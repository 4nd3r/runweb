# pylint: disable=C0103,C0111,C0209,E0611,R0903,R1732,W0621

import argparse
import fcntl
import os
import signal
import subprocess
import sys

from PyQt6.QtCore import QUrl
from PyQt6.QtWebEngineCore import QWebEnginePage, QWebEngineProfile, QWebEngineSettings
from PyQt6.QtWebEngineWidgets import QWebEngineView
from PyQt6.QtWidgets import QApplication


APP = "runweb"


def log(*log):
    print(": ".join(map(str, list((APP,) + log))))


class RunWebApp(QApplication):
    def __init__(self, args):
        super().__init__([args.profile or "otr", APP])
        self.setApplicationName(APP)
        signal.signal(signal.SIGINT, signal.SIG_DFL)
        self.profile = RunWebProfile(args.profile)
        self.url = QUrl(args.url)
        log("url", args.url)


class RunWebProfile(QWebEngineProfile):
    def __init__(self, name):
        super().__init__(name)
        log("profile", name)
        log("otr", self.isOffTheRecord())
        log("cache", self.cachePath() or None)
        log("data", self.persistentStoragePath() or None)
        self.setNotificationPresenter(self.notify)

    view = None

    def notify(self, notification):
        if self.view:
            log("attention")
            QApplication.alert(self.view)
        log("notification")
        subprocess.Popen([
            "notify-send",
            "{}: {}".format(self.storageName() or APP, notification.title()),
            notification.message(),
        ])


class RunWebPage(QWebEnginePage):
    permittedFeatures = [
        QWebEnginePage.Feature.DesktopAudioVideoCapture,
        QWebEnginePage.Feature.DesktopVideoCapture,
        QWebEnginePage.Feature.MediaAudioCapture,
        QWebEnginePage.Feature.MediaAudioVideoCapture,
        QWebEnginePage.Feature.MediaVideoCapture,
        QWebEnginePage.Feature.Notifications
    ]

    def __init__(self, profile, url):
        super().__init__(profile)
        for webattr in [[QWebEngineSettings.WebAttribute.PlaybackRequiresUserGesture, False]]:
            self.settings().setAttribute(*webattr)
        for feature in self.permittedFeatures:
            self.onPermission(url, feature)
        self.featurePermissionRequested.connect(self.onPermission)
        self.newWindowRequested.connect(self.onNewWindow)

    def onPermission(self, url, feature):
        if feature not in self.permittedFeatures:
            return False
        return self.setFeaturePermission(
            url,
            feature,
            self.PermissionPolicy.PermissionGrantedByUser
        )

    def onNewWindow(self, request):
        url = request.requestedUrl()
        log("window", url.url())
        if not self.openExternalUrl(url):
            self.setUrl(url)

    def openExternalUrl(self, url):
        if url.host() == self.url().host():
            return False
        log("xdg-open", url.url())
        subprocess.Popen(["xdg-open", url.url()])
        return True

    def acceptNavigationRequest(self, url, navigationType, isMainFrame):
        if navigationType == QWebEnginePage.NavigationType.NavigationTypeLinkClicked:
            log("click", url.url())
            if self.openExternalUrl(url):
                return False
        return super().acceptNavigationRequest(url, navigationType, isMainFrame)


class RunWebView(QWebEngineView):
    def __init__(self, page):
        super().__init__()
        self.setPage(page)
        self.setZoomFactor(float(os.getenv("RUNWEB_ZOOMFACTOR", "1.0")))
        self.iconChanged.connect(lambda: self.setWindowIcon(self.icon()))
        self.titleChanged.connect(lambda: self.setWindowTitle(self.title()))
        page.profile().view = self


def main():
    parser = argparse.ArgumentParser(description="run website like an app")
    parser.add_argument(
        "-p",
        dest="profile",
        metavar="NAME",
        default=None,
        help="persistent profile name",
    )
    parser.add_argument("url", metavar="URL")
    args = parser.parse_args()
    if args.profile:
        lock = "{}/runweb-{}.lock".format(os.getenv("XDG_RUNTIME_DIR"), args.profile)
        try:
            fcntl.lockf(
                os.open(lock, os.O_WRONLY | os.O_CREAT, 0o600),
                fcntl.LOCK_EX | fcntl.LOCK_NB
            )
        except IOError:
            log("{} is already running".format(args.profile))
            sys.exit(1)
    app = RunWebApp(args)
    page = RunWebPage(app.profile, app.url)
    view = RunWebView(page)
    page.setUrl(app.url)
    view.showMaximized()
    return app.exec()
