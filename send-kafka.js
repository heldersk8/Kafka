var kafka = require('kafka-node'),
	nomeDoTopico = 'arquivosNaoProcessados'
    Producer = kafka.Producer,
    Consumer = kafka.Consumer,
    KeyedMessage = kafka.KeyedMessage,
    client =new kafka.KafkaClient(),
    producer = new Producer(client),
    km = new KeyedMessage('key', 'message'),
    payloads = [{ topic: nomeDoTopico, messages: 'hello', partition: 0 }],
    consumer = new Consumer(client, [{ topic: nomeDoTopico, partition: 0 }], { autoCommit: false });

console.log(client);
producer.on('ready', function () {

	producer.createTopics([nomeDoTopico], true, function (err, data) {
        console.log(`Criou o tópico ${data}`);
	});

    producer.send(payloads, function (err, data) {
        console.log("Enviou para fila");
    });

    consumer.on('message', function (message) {
        console.log(`Leu a messagem ${message.value}`);
	});
});
