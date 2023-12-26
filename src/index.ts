import { joinVoiceChannel } from '@discordjs/voice';
import { rewenqq } from './_client';
import Settings from '../Settings.json';
import { VoiceChannel, VoiceBasedChannel, StageChannel, GuildMember } from 'discord.js';

declare module 'discord.js' {
  interface VoiceChannel {
    hasStaff(checkMember?: GuildMember): boolean;
    getStaffs(checkMember?: GuildMember): number;
  }
}

for (let index = 0; index < Settings.tokens.length; index++) {
    const token = Settings.tokens[index];
    const channel = Settings.channels.length < 1 ? Settings.channels[0] : Settings.channels[index];
    if (channel) {
        const client = new rewenqq();

        client.login(token).catch(err => {
            console.log(`${index + 1}. Satırdaki Token Arızalı!`);
        });
        client.on("voiceStateUpdate", async (oldState, newState) => { 
            if(oldState.member.id === client.user.id && oldState.channelId && !newState.channelId) {
                client.user.setPresence({ activities: [{name: Settings.state}], status: "dnd" })
                let guild = client.guilds.cache.get(Settings.guild);
                if(!guild) return console.log("sunucu yok!");
                let Channel = global.Voice = guild.channels.cache.get(channel) as VoiceChannel;
                if(!Channel) return console.log("channel yok");
                client.voiceConnection = await joinVoiceChannel({
                    channelId: Channel.id,
                    guildId: Channel.guild.id,
                    adapterCreator: Channel.guild.voiceAdapterCreator,
                    group: client.user.id
                });
            }
        })
        
        client.on('ready', async () => {
            console.log(`${client.user.tag}`)
            client.user.setPresence({ activities: [{name: Settings.state}], status: "dnd" })
            let guild = client.guilds.cache.get(Settings.guild);
            if(!guild) return console.log("sunucu yok!");
            let Channel = global.Voice = guild.channels.cache.get(channel) as VoiceChannel;
            if(!Channel) return console.log("channel yok");
            client.voiceConnection = await joinVoiceChannel({
                channelId: Channel.id,
                guildId: Channel.guild.id,
                adapterCreator: Channel.guild.voiceAdapterCreator,
                group: client.user.id
            });
            if(!Channel.hasStaff()) await client._start(channel)
            else client.staffJoined = true, client.playing = false, await client._start(channel);
            
        })
        
        client.on('voiceStateUpdate', async (oldState, newState) => {
            // Yeni veya eski kanalın VoiceChannel olup olmadığını kontrol et
            const newVoiceChannel = newState.channel instanceof VoiceChannel ? newState.channel : null;
            const oldVoiceChannel = oldState.channel instanceof VoiceChannel ? oldState.channel : null;
          
            if (newVoiceChannel && newState.member && newState.member.isStaff()) {
              if (newState.channelId === channel && !newVoiceChannel.hasStaff(newState.member)) {
                client.staffJoined = true;
                client.player.stop();
                return;
              }
            }
          
            if (oldVoiceChannel && oldState.member && oldState.member.isStaff()) {
              if (oldState.channelId === channel && !oldVoiceChannel.hasStaff()) {
                client.staffJoined = false;
                {
                    client.staffJoined = false;
                    client._start(channel)
                    return 
                }
              }
            }
          });
             
    }}