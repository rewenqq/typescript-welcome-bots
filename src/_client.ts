import {
    Client,
    GatewayIntentBits,
    Partials,
    VoiceChannel,
    GuildMember,
    PermissionFlagsBits
  } from 'discord.js';
  import {
    createAudioPlayer,
    createAudioResource,
    NoSubscriberBehavior,
    AudioPlayerStatus,
    joinVoiceChannel
  } from '@discordjs/voice';
  import play from 'play-dl';
  import Settings from '../Settings.json';
  
  export class rewenqq extends Client {
    player: any;
    url: string;
    stream: any;
    message: any;
    channelId: string;
    playing: boolean;
    voiceConnection: any;
    staffJoined: boolean;
  
    constructor() {
      super({
        intents: [
          GatewayIntentBits.Guilds,
          GatewayIntentBits.GuildMembers,
          GatewayIntentBits.GuildVoiceStates,
          GatewayIntentBits.GuildIntegrations
        ],
        partials: [Partials.Channel, Partials.GuildMember, Partials.User]
      });
  
      // Initialize properties
      this.player = createAudioPlayer({
        behaviors: {
          noSubscriber: NoSubscriberBehavior.Play,
        },
      });
  
      this.url = Settings.youtube
        this.stream;
        this.message;
        this.channelId;
        this.playing;
        this.voiceConnection;
        this.staffJoined = false;
    
        this.on("guildUnavailable", async (guild) => {  })
        .on("disconnect", () => {})
        .on("reconnecting", () => {})
        .on("error", (e) => console.log(e))
        .on("warn", (info) => console.log(info));

        process.on("unhandledRejection", (err) => { console.log(err) });
        process.on("warning", (warn) => { console.log(warn) });
        process.on("beforeExit", () => { console.log('Sistem kapatılıyor...'); });
        process.on("uncaughtException", err => {
            const hata = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
                console.error("Beklenmedik Hata: ", hata);
               // process.exit(1);
        });

     
    }
    public async _start(channelId) {
        let guild = this.guilds.cache.get(Settings.guild);
        if(!guild) return console.log("sunucu yok!");
        let channel = guild.channels.cache.get(channelId);
        if(!channel) return console.log("kanal yok");
        this.channelId = channelId;
    
        let connection = this.voiceConnection 
        let stream;
        let resource;
        if(Settings.local) {
            resource = this.stream = createAudioResource(Settings.file); 
        } else {
            stream = await play.stream(this.url);
            resource = this.stream = createAudioResource(stream.stream, {
                inputType: stream.type,
            }); 
        }
        
        let player = this.player
        
        player.on(AudioPlayerStatus.Playing, () => {
       
        });
        player.on(AudioPlayerStatus.Paused, () => {
            
        });
        player.on('idle', async () => {
            if(this.staffJoined == true) return;
            if(Settings.local) {
                resource = this.stream = createAudioResource(Settings.file); 
            } else {
                stream = await play.stream(this.url);
                resource = this.stream = createAudioResource(stream.stream, {
                    inputType: stream.type,
                }); 
            }
            this.player.play(resource);
        });
        if(this.staffJoined == true) return;
        player.play(resource)
        connection.subscribe(player);
    }
    // _start method and other methods...
  }
  
  // Extend VoiceChannel and GuildMember prototype
  declare module 'discord.js' {
    interface VoiceChannel {
      hasStaff(checkMember?: GuildMember): boolean;
      getStaffs(checkMember?: GuildMember): number;
    }
  
    interface GuildMember {
      isStaff(): boolean;
    }
  }
  
  
VoiceChannel.prototype.hasStaff = function (this: VoiceChannel, checkMember?: GuildMember) {
  // Kodunuz burada
  return this.members.some(m => (!checkMember || m.id !== checkMember.id) && !m.user.bot && m.roles.highest.position >= this.guild.roles.cache.get(Settings.staff_role).position);
};

VoiceChannel.prototype.getStaffs = function (this: VoiceChannel, checkMember?: GuildMember) {
  // Kodunuz burada
  return this.members.filter(m => (!checkMember || m.id !== checkMember.id) && !m.user.bot && m.roles.highest.position >= this.guild.roles.cache.get(Settings.staff_role).position).size;
};

  
  GuildMember.prototype.isStaff = function (this: GuildMember) {
    // Implementation...
    if(
        !this.user.bot &&
        (
            this.permissions.has(PermissionFlagsBits.Administrator) ||
           this.roles.highest.position >= this.guild.roles.cache.get(Settings.staff_role).position
        )
    ) return true;
    return false;
  };