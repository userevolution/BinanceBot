"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const web3_1 = __importDefault(require("web3"));
require('dotenv').config();
/**
 *  Constants of faucet and tokens
 *
 */
const TOKEN_DECIMAL = 18n;
const FAUCET_SEND_INTERVAL = 1; // time in hours
const EMBED_COLOR_CORRECT = 0xf0B90B;
const EMBED_COLOR_ERROR = 0x12161c;
const CONSTANT = 10;
const FAUCET_SEND_MSG = "!faucet send";
const FAUCET_BALANCE_MSG = "!balance";
const ADDRESS_LENGTH = 40;
const GAS_PRICE = "0x9184e72a000";
const GAS = "0x76c0";
const TOKEN_NAME = "BNB";
const ADDRESS_PREFIX = "0x";
/**
 *  Params for discord  account configuration
 *
 */
const params = {
    DISCORD_TOKEN: process.env.DISCORD_TOKEN,
    DISCORD_CHANNEL: process.env.DISCORD_CHANNEL,
    RPC_URL: process.env.RPC_URL,
    ACCOUNT_KEY: process.env.ACCOUNT_KEY,
    TOKEN_COUNT: BigInt(process.env.TOKEN_COUNT || CONSTANT),
};
const web3Api = new web3_1.default(params.RPC_URL);
Object.keys(params).forEach(param => {
    if (!params[param]) {
        console.log(`Missing ${param} env variables`);
        process.exit(1);
    }
});
/**
 *  Server Messages
 *
 */
console.log(`Starting bot...`);
console.log(`Connecting web3 to ${params.RPC_URL}...`);
const client = new discord_js_1.Client();
const receivers = {};
/**
 *  Login user
 *
 */
client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
});
/**
 * Returns the approximated remaining time until being able to request tokens again.
 * @param {Date} lastTokenRequestMoment
 */
const nextAvailableToken = (lastTokenRequestMoment) => {
    const msPerMinute = 60 * 1000;
    const msPerHour = msPerMinute * 60;
    const availableAt = lastTokenRequestMoment + (FAUCET_SEND_INTERVAL * msPerHour);
    let remain = availableAt - Date.now();
    if (remain < msPerMinute) {
        return `${Math.round(remain / 1000)} second(s)`;
    }
    else if (remain < msPerHour) {
        return `${Math.round(remain / msPerMinute)} minute(s)`;
    }
    else {
        return `${Math.round(remain / msPerHour)} hour(s)`;
    }
};
/**
 *  Send Faucet from message
 * @param {string} msg
 */
const onReceiveMessage = async (msg) => {
    const authorId = msg.author.id;
    const messageContent = msg.content;
    const channelId = msg.channel.id;
    if (messageContent.startsWith(`${FAUCET_SEND_MSG}`)) {
        console.log("sending ...");
        if (receivers[authorId] > Date.now() - 3600 * 1000) {
            const errorEmbed = new discord_js_1.MessageEmbed()
                .setColor(EMBED_COLOR_ERROR)
                .setTitle(`You already received tokens!`)
                .addField("Remaining time", `You still need to wait ${nextAvailableToken(receivers[authorId])} to receive more tokens`)
                .setFooter("Funds transactions are limited to once per hour");
            msg.channel.send(errorEmbed);
            return;
        }
        let address = messageContent.slice(`${FAUCET_SEND_MSG}`.length).trim();
        if (address.startsWith(`${ADDRESS_PREFIX}`)) {
            address = address.slice(`${ADDRESS_PREFIX}`.length);
        }
        if (address.length != `${ADDRESS_LENGTH}`) {
            const errorEmbed = new discord_js_1.MessageEmbed()
                .setColor(EMBED_COLOR_ERROR)
                .setTitle("Invalid address")
                .setFooter("Addresses must follow the H160 address format");
            msg.channel.send(errorEmbed);
            return;
        }
        receivers[authorId] = Date.now();
        await web3Api.eth.sendSignedTransaction((await web3Api.eth.accounts.signTransaction({
            value: `${params.TOKEN_COUNT * (10n ** TOKEN_DECIMAL)}`,
            gasPrice: `${GAS_PRICE}`,
            gas: `${GAS}`,
            to: `${ADDRESS_PREFIX}${address}`,
        }, params.ACCOUNT_KEY)).rawTransaction);
        const accountBalance = BigInt(await web3Api.eth.getBalance(`0x${address}`));
        const fundsTransactionEmbed = new discord_js_1.MessageEmbed()
            .setColor(EMBED_COLOR_CORRECT)
            .setTitle("Transaction of funds")
            .addField("To account", `${ADDRESS_PREFIX}${address}`, true)
            .addField("Amount sent", `${params.TOKEN_COUNT} ${TOKEN_NAME}`, true)
            .addField("Current account balance", `${accountBalance / (10n ** TOKEN_DECIMAL)} ${TOKEN_NAME}`)
            .setFooter("Funds transactions are limited to once per hour");
        msg.channel.send(fundsTransactionEmbed);
    }
    if (messageContent.startsWith(`${FAUCET_BALANCE_MSG}`)) {
        let address = messageContent.slice(`${FAUCET_BALANCE_MSG}`.length).trim();
        if (address.startsWith(`${ADDRESS_PREFIX}`)) {
            address = address.slice(`${ADDRESS_PREFIX}`.length);
        }
        if (address.length != `${ADDRESS_LENGTH}`) {
            const errorEmbed = new discord_js_1.MessageEmbed()
                .setColor(EMBED_COLOR_ERROR)
                .setTitle("Invalid address")
                .setFooter("Addresses must follow the H160 address format");
            msg.channel.send(errorEmbed);
            return;
        }
        const accountBalance = BigInt(await web3Api.eth.getBalance(`0x${address}`));
        const balanceEmbed = new discord_js_1.MessageEmbed()
            .setColor(EMBED_COLOR_CORRECT)
            .setTitle("Account Balance")
            .addField("Account", `${ADDRESS_PREFIX}${address}`, true)
            .addField("Balance", `${accountBalance / (10n ** TOKEN_DECIMAL)} ${TOKEN_NAME}`, true);
        msg.channel.send(balanceEmbed);
    }
};
/**
 *  only for testing bot purpose
 *
 */
client.on("message", async (msg) => {
    try {
        if (msg.content === 'ping') {
            msg.channel.send('pong');
            client.user.setActivity("pong activity", { type: "WATCHING" });
            /*msg.channel.send({embed: {
              color: 3447003,
              description: "A very simple Embed!",
             
            }});*/
        }
        await onReceiveMessage(msg);
    }
    catch (e) {
        msg.reply('ERROR');
        console.log(new Date().toISOString(), "ERROR", e.stack || e);
    }
});
client.login(params.DISCORD_TOKEN);
