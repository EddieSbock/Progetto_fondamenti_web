import swaggerAutogen from 'swagger-autogen';

const option = {
  info: {
    title: 'Documentazione REFILM',
    description: 'Documentazione sulle api per il blog di cinema REFILM',
    version: '1.0.0'
  },
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
      description: "token JWT nel formato: Bearer <token>"
    }
  }
};

const outputFile = './swaggerFile.json';
const routes = ['./index.js'];

swaggerAutogen(outputFile, routes, option).then(() => {
  console.log('Operazione andata a buon fine');
});