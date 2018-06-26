const readline = require('readline');
const fs = require('fs')
let itensParaSeremEnviadosParaFila = [];
const rl = readline.createInterface({
  input: fs.createReadStream('urls.txt'),
  crlfDelay: Infinity
});

var kafka = require('kafka-node'),
	nomeDoTopico = 'arquivosNaoProcessados'
    Producer = kafka.Producer,
    Consumer = kafka.Consumer,
    KeyedMessage = kafka.KeyedMessage,
    client =new kafka.KafkaClient(),
    producer = new Producer(client),
    producer2 = new Producer(client),
    km = new KeyedMessage('key', 'message'),
    consumer = new Consumer(client, [{ topic: nomeDoTopico, partition: 0 }], { autoCommit: false });
    consumer2 = new Consumer(client, [{ topic: nomeDoTopico, partition: 0 }], { autoCommit: false });

producer.on('ready', function () {
	producer.createTopics([nomeDoTopico], true, function (err, data) {
	        console.log(`Criou o tópico ${data}`);
	});
});

rl.on('line', (line) => {
  console.log(itensParaSeremEnviadosParaFila);
  itensParaSeremEnviadosParaFila.push(line);

  if(itensParaSeremEnviadosParaFila.length == 10) {
    let payloads = [{ topic: nomeDoTopico, messages: JSON.stringify(itensParaSeremEnviadosParaFila), partition: 0 }];

  	producer.on('ready', function () {
	    producer.send(payloads, function (err, data) {
	        console.log(data);
	        itensParaSeremEnviadosParaFila = [];
	    });
	});
  }
});

producer.on('ready', function () {
    consumer.on('message', function (message) {
        console.log(`Leu a messagem ${message.value}`);
	});
});

producer2.on('ready', function () {
    consumer2.on('message', function (message) {
        console.log(`Leu a messagem 2 ${message.value}`);
	});
});