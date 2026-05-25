const rateLimit = require('express-rate-limit')

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
	  limit: 5,
    standardHeaders: true,
    legacyHeaders: false, 
    ipv6Subnet: 56,
    trustProxy: true,
    handler: (req, res) => {
    console.error(
      `Rate limit exceeded: ${req.ip} ${req.originalUrl}`
    )
    res.status(429).json({
      error: "Previše upita"
    });
    }
})

module.exports = limiter