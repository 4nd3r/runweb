# runweb

Run website like an app.

I use it with tiling window manager on Debian Sid.

Works for me. No support. No warranty. PRs welcome.

## Build & Install
```
sudo apt install nodejs yarnpkg
git clone https://github.com/4nd3r/runweb
cd runweb
make
runweb https://example.com
```

## Injecting
```
mkdir "$HOME/.config/runweb/Inject"
cat > "$HOME/.config/runweb/Inject/example.com.js" << EOF
console.log('IT WORKS!');
EOF
```
