const redis = require('redis');
const client = redis.createClient();


//bull:scraperjs:Kmart:9797

function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}

client.keys('bull:*', (err, replies) => {
  if (err) {
    console.error(err);
    process.exit();
  }

  const keys = replies.map(key => {
//    console.log(key);
    const queueKey = key.match(/^(bull:.*):id$/);
    if (queueKey === null) {
 //     console.log(queueKey);
      return undefined;
    }
    return queueKey[1];
  })
    .filter(onlyUnique)
    .filter(x => x);

  const config = {
    queues: keys.map(x => {
      return {
        name: x.replace('bull:', ''),
        port: 6379,
        host: '127.0.0.1',
        hostId: 'local',
      };
    })
  };

  console.log(JSON.stringify(config, null, 2));
  process.exit();
});
