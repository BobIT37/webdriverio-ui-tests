let nodemailer = require('nodemailer');
const dayjsN = require('dayjs')
const fs = require('fs');
const path = require('path');

/**
 * This file provide to send report via email by using Google email service
 * @param fileName
 * @param dateObj
 */
module.exports.sendMail = (fileName, dateObj) => {
    const helpersData = JSON.parse(fs.readFileSync(path.join(__dirname,"../helpers-data.json")));
    const dayjs = dayjsN(dateObj);
    const exactDate = dayjs.format("MM/DD/YYYY")
    const hours = dayjs.format("hh:mm:ss a")
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: helpersData.mailerCreds.username,
            pass: helpersData.mailerCreds.password
        }
    });

    const htmlFile = fs.readFileSync( `${process.cwd()}/report/${fileName}.html`).toString()
    var passedCount = htmlFile.match(/scenarios Passed: (\d+)/)[1]
    var failedCount = htmlFile.match(/scenarios Failed: (\d+)/)[1]

    const receivers = helpersData.emailList;

    let mailOptions = {
        from: helpersData.mailerCreds.username,
        to: receivers.join(", "),
        subject: `[${exactDate} ${hours}] Passed Tests:${passedCount} - Failed Tests: ${failedCount} Ownbackup Automation Tests Report `,
        text:
        "Hi,\n\n" +
        `Attached Ownbackup Automation Test report on ${exactDate} ${hours}. \n\nFailed Tests:${failedCount}. 
        \nPassed Tests:${passedCount} \n\nPlease download the report on your machine to see all the details. 
        \nIf you have any question regarding the report, please email me at bob.turkmen@bobit.us \n\nAutomation Team.`,
        attachments: [
            {
                filename: `${fileName}.html`,
                path: `${process.cwd()}/report/${fileName}.html`,
            }
        ]
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}
