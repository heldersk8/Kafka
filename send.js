var amqp = require('amqplib/callback_api');
			 
amqp.connect('amqp://guest:guest@localhost', function(err, conn) {
	if(err)
		console.log(err);

	console.log(conn);
  conn.createChannel(function(err, ch) {
    var q = 'hello';
    var msg = 'Hello World!';

    ch.assertQueue(q, {durable: false});
    console.log(" [x] Sent %s", msg);
  });
  setTimeout(function() { conn.close(); process.exit(0) }, 500);
});