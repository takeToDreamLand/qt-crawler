# Qt All Version Source Code Crawler
Use for crawling Qt all version source code and install package.
## Usage
```bash
npm install 
npm run start
```

## Docker
Use playwright docker to run crawler easyly.
```bash
# pull playwright docker
docker pull mcr.microsoft.com/playwright:focal
# run the docker
docker run -it --rm --ipc=host mcr.microsoft.com/playwright:focal /bin/bash
# clone this repo and enter its directory. Then run refer the `Usage` part.
```

