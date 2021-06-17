const PORT = process.env.PORT || 3333;
const IsPROD = process.env.NODE_ENV === 'production';
const ProdLogFormate = ':id :remote-addr - :remote-user [:date [web]] " :method :url HTTP/:http-version"  :status  :res[content-length]';
const LIMIT = 10;

module.exports = { PORT, IsPROD, ProdLogFormate,LIMIT };
