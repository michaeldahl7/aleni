

FROM node:20

# Create SSH directory and add the private key
RUN mkdir -p ~/.ssh

RUN echo "-----BEGIN OPENSSH PRIVATE KEY-----\n\
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZW\n\
QyNTUxOQAAACBe039weiS7zwUkfo3mCLfoeWxdBGiUs40Fd5itqLllYwAAAKD9ux5+/bse\n\
fgAAAAtzc2gtZWQyNTUxOQAAACBe039weiS7zwUkfo3mCLfoeWxdBGiUs40Fd5itqLllYw\n\
AAAEAZX5QarN1WHpJckLrBfGsDy2sEYnYDC5sxlQna/xRJb17Tf3B6JLvPBSR+jeYIt+h5\n\
bF0EaJSzjQV3mK2ouWVjAAAAF3BocHNlY2xpYi1nZW5lcmF0ZWQta2V5AQIDBAUG\n\
-----END OPENSSH PRIVATE KEY-----" > ~/.ssh/id_ed25519

RUN chmod 600 ~/.ssh/id_ed25519

RUN ssh-keyscan -t rsa github.com >> ~/.ssh/known_hosts

# Set working directory
WORKDIR /app

# Clone the repository
RUN git clone git@github.com:michaeldahl7/aleni.git .

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install

# Run drizzle migration
RUN pnpm db:push

RUN pnpm drizzle-kit studio --port 5555 --host 0.0.0.0 --verbose