const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);


const sendContactEmail = async (name, email, phone, message) => {
  return await resend.emails.send({
    from: "Konoba Ivina Arka <onboarding@resend.dev>",
    to: process.env.EMAIL,
    subject: "KONTAKT",
    text: `${name} (${email} - ${phone})\n\n${message}`,
  });
};

const sendBookingConfirmation = async (name, email, phone, date, time, people) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    let dateFormat = new Date(date).toLocaleDateString('en-US', options);

    const [hours, minutes] = time.split(":");
    let timeFormat = `${hours}:${minutes}`;

    return await resend.emails.send({
        from: "Konoba Ivina Arka <onboarding@resend.dev>",
        to: email,
        subject: "REZERVACIJA",
        text: `Poštovani ${name}. Vaša rezervacija ${dateFormat} u ${timeFormat} za ${people} je uspješna. Vidimo se!`
    });
};

const sendBookingRejection = async (name, email, phone, date, time, people) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    let dateFormat = new Date(date).toLocaleDateString('en-US', options);

    const [hours, minutes] = time.split(":");
    let timeFormat = `${hours}:${minutes}`;

    return await resend.emails.send({
        from: "Konoba Ivina Arka <onboarding@resend.dev>",
        to: email,
        subject: "REZERVACIJA",
        text: `Poštovani ${name}. Vaša rezervacija ${dateFormat} u ${timeFormat}, nažalost nije uspješna.`
    });
};

const bookingConfirmationNotification = async (email, konoba) => {
    return await resend.emails.send({
        from: "Konoba Ivina Arka <onboarding@resend.dev>",
        to: konoba,
        subject: "ZAHTJEV ZA REZERVACIJU",
        text: `Zahtjev za rezervaciju od ${email}, potvrdi/odbij u admin panelu: https://www.konobaivinaarka.com/admin-confirm`
    });
};

module.exports = { sendContactEmail, sendBookingConfirmation, sendBookingRejection, bookingConfirmationNotification }