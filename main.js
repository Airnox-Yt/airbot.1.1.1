const {Client, Message, Collection, Discord} = require('discord.js');
const {readdirSync} = require("fs");
const {TOKEN, PREFIX} = require('./config');


const client = new Client();
client.commands = new Collection();

const loadCommands = (dir = "./commands/") => {
    readdirSync(dir).forEach(dirs => {
        const commands = readdirSync(`${dir}/${dirs}/`).filter(files => files.endsWith(".js"))

        for (const file of commands) {
            const getFileName = require(`${dir}/${dirs}/${file}`);
            client.commands.set(getFileName.help.name, getFileName);
            console.log(`Commande chargée: ${getFileName.help.name}`);
        };
    });
};

loadCommands();


client.on('ready', () => {
    console.log(`${client.user.tag} est lancé ! Merci pour sa !`);
    client.user.setStatus("dnd");
    setTimeout(() => {
        client.user.setActivity("v.1.1.1" );
    }, 100)
});

client.on('message', message => {
    if (!message.content.startsWith(PREFIX) || message.author.bot) return;
const args = message.content.slice(PREFIX.length).split(/ +/);
const user = message.mentions.users.first();
console.log(args);
const commandName = args.shift().toLowerCase();




const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.help.aliases && cmd.help.aliases.includes(commandName));
if (!command) return ;

if (command.help.args &&  !args.length) {
     let NoArgsReply = `Il nous faut plus de précision ${message.author} !`;
if (command.help.permissions && !message.member.hasPermission('BAN_MEMBERS')) return message.reply("Oups ! Tu n'a pas les permissions !")

 if (command.help.usage) NoArgsReply += `\nVoici comment utilisé la commande: \`${PREFIX}${command.help.name} ${command.help.usage}\` ` ;
    return message.channel.send(NoArgsReply);
}
if (command.help.isUserAdmin && !user) return message.reply("Oups ! Tu n'a pas mensionnez d'utilisateure")
if (command.help.isUserAdmin && message.guild.member(message.mentions.users.first()).hasPermission('BAN_MEMBERS')) return message.reply("Oups ! Tu ne peut pas utilisé cette comande contre cette personne !")
if (command.help.isUserAdmin && message.guild.member(message.mentions.users.first()).hasPermission('ADMINISTRATOR')) return message.reply("Oups ! Tu ne peut pas utilisé cette comande contre cette personne !")






console.log(command);

command.run(client, message, args);


console.log(command);

   
    
});

client.login(TOKEN);