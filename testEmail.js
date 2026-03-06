const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

async function test() {
  const res = await resend.emails.send({
    from: 'Eyas Adam <onboarding@resend.dev>',
    to: 'eyasadam878@gmail.com',
    subject: 'Test Email',
    html: '<h1>Hello</h1>',
  });

  console.log(res);
}

test();
