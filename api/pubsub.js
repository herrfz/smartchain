const PubNub = require('pubnub');
const Transaction = require('../transaction');

const credentials = {
    publishKey: 'pub-c-3752ef4f-0cba-4ae1-b58d-2b2c16ec8db5',
    subscribeKey: 'sub-c-1e2f62e0-2cb6-11ea-aaf2-c6d8f98a95a1',
    secretKey: 'sec-c-YzVkZTJhOTAtNTI0Ny00YWNjLTg1MGEtN2Y2N2YzMThlZDIw'
};

const CHANNELS_MAP = {
    TEST: 'TEST',
    BLOCK: 'BLOCK',
    TRANSACTION: 'TRANSACTION'
};

class PubSub {
    constructor({ blockchain, transactionQueue }) {
        this.pubnub = new PubNub(credentials);
        this.blockchain = blockchain;
        this.transactionQueue = transactionQueue;
        this.subscribeToChannels();
        this.listen();
    }

    subscribeToChannels() {
        this.pubnub.subscribe({
            channels: Object.values(CHANNELS_MAP)
        });
    }

    publish({ channel, message }) {
        this.pubnub.publish({ channel, message });
    }

    listen() {
        this.pubnub.addListener({
            message: messageObject => {
                const { channel, message } = messageObject;

                console.log('Message received. Channel:', channel);

                const parsedMessage = JSON.parse(message);

                switch (channel) {
                    case CHANNELS_MAP.BLOCK:
                        console.log('block message', message);
                        this.blockchain.addBlock({
                            block: parsedMessage,
                            transactionQueue: this.transactionQueue
                        }).then(() => console.log('New block accepted', parsedMessage))
                          .catch(error => console.error('New block rejected:', error.message));
                        break;
                    case CHANNELS_MAP.TRANSACTION:
                        console.log(`Received transaction: ${parsedMessage.id}`);

                        this.transactionQueue.add(new Transaction(parsedMessage));

                        break;
                    default:
                        return;
                }
            }
        });
    }

    broadcastBlock(block) {
        this.publish({
            channel: CHANNELS_MAP.BLOCK,
            message: JSON.stringify(block)
        });
    }

    broadcastTransaction(transaction) {
        this.publish({
            channel: CHANNELS_MAP.TRANSACTION,
            message: JSON.stringify(transaction)
        });
    }
}

module.exports = PubSub;
