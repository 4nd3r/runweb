# runweb

run website as app

works for me, no support, no warranty

```
sudo apt install nodejs npm
git clone https://github.com/4nd3r/runweb
cd runweb
npm install
npm run-script mkdeb
sudo dpkg -i dist/*.deb
sudo apt install -f
runweb https://riot.im/app
```
