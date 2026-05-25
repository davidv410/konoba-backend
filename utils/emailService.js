const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
    }
})

const sendContactEmail = async (name, email, phone, message) => {
    try{
        const mailStructure = { 
            from: email,
            to: process.env.EMAIL, 
            subject: `KONTAKT`,
            text: `${name} (${email} - ${phone})
            ${message}` 
        }
        return transporter.sendMail(mailStructure)
    }catch(err){
        console.error("SMTP ERROR:", err);
        throw err;
    }
}

const sendBookingConfirmation = async (name, email, phone, date, time, people) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    let dateFormat = new Date(date).toLocaleDateString('en-US', options);

    const [hours, minutes] = time.split(":");
    let timeFormat = `${hours}:${minutes}`

    const mailStructure = {
            from: 'KONOBA IVINA ARKA',
            to: email,
            subject: 'REZERVACIJA',
            text: `Poštovani ${name}. Vaša rezervacija ${dateFormat} u ${timeFormat} za ${people}, je uspješna. Vidimo se!`
    }

    return transporter.sendMail(mailStructure)
}

const sendBookingRejection = async (name, email, phone, date, time, people) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    let dateFormat = new Date(date).toLocaleDateString('en-US', options);

    const [hours, minutes] = time.split(":");
    let timeFormat = `${hours}:${minutes}`

    const mailStructure = {
            from: 'KONOBA IVINA ARKA',
            to: email,
            subject: 'REZERVACIJA',
            text: `Poštovani ${name}. Vaša rezervacija ${dateFormat} u ${timeFormat}, nažalost nije uspješna.`
        }
    return transporter.sendMail(mailStructure)
}

const bookingConfirmationNotification = async (email, konoba) => {
    let mailStructure = {
        from: email,
        to: konoba,
        subject: 'ZAHTJEV ZA REZERVACIJU',
        text: `Zahtjev za rezervaciju od ${email}, potvrdi/odbij u admin panelu, https://www.konobaivinaarka.com/admin-confirm` 
    }
    return transporter.sendMail(mailStructure)
}

module.exports = { sendContactEmail, sendBookingConfirmation, sendBookingRejection, bookingConfirmationNotification }