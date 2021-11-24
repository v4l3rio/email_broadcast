const { time } = require('console');
const { DH_UNABLE_TO_CHECK_GENERATOR } = require('constants');
const fs = require('fs');
const nodemailer = require('nodemailer');
const log = console.log;
var emailInviate = 0;

/**
 * La variabile destinatari prende tutti i destinatari presenti nel file 
 * destinatari.json, all'interno del file è presente un array 
 * con elementi string separati da virgole.
 */
const destinatari = JSON.parse(fs.readFileSync('destinatari.json', 'utf8'));

/**
 * La variabile config gestisce tutte le personalizzazioni, email, password, host, port...
 * Tutti questi valori sono presenti in un file config.json
 */
const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

/**
 * Il corpo dell'email va scritto nel file template.txt, in formato testuale.
 * nodemailer lo convertirà in formato html.
 */
const corpoEmail = fs.readFileSync('template.txt', 'utf8');

/**
 * Il trasporter, opportunamente inizializzato con i valori presenti nel file config.json
 */
let transporter = nodemailer.createTransport({
    host: config['host'],
    port: config['port'],
    pool: true,
    maxConnections: config['maxConnections'],
    secure: true, // upgrade later with STARTTLS
    auth: {
        user: config['email'],
        pass: config['password'],
    },
});

/**
 * Creo una email, selezionando mittente, destinatari, corpo ed eventuali allegati.
 */
const sendEmail = async function (props) {

let mailOptions = {
    from: config['from'], 
    to: props.element,
    subject: config['subject'],
    text: corpoEmail,
    attachments: [{
            filename: config['attachments_filename'],
            path: config['attachments_filepath']
        } 
    ]
};

    // remove callback and function sendMail will return a Promise
    return transporter.sendMail(mailOptions);
};

/**
 * Per ogni destinatario presente all'interno del fine destinatari lo script invierà una email.
 * Se gli indirizzi sono tanti potrebbe volerci qualche minuto.
 */
destinatari.forEach(async element => {
    try {
        let res = await sendEmail({element});
        console.log("Email Inviata correttamente! a: "+element+ ", inviate: "+(++emailInviate));
      } catch (e) {
        console.log(e);
        console.log("\n");
        console.log("L'email in cui ho avuto un errore è : "+element);
      }
});
