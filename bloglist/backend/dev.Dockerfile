FROM node:16

WORKDIR /usr/src/app

COPY . .

RUN npm install

CMD [ "npm", "uninstall", "bcrypt" ]
CMD [ "npm", "install", "bcrypt" ]

CMD ["npm", "run", "dev"]