import Discord from 'discord.js';
import { Subject } from 'rxjs';
import { filter, take } from 'rxjs/operators';

import { findChannelByName } from '../src/utils'
import { DiscordClient } from '../src/discordClient';
import { commandList } from '../src/commandList';

const TEST_CHANNEL: string = 'butt-tester'

describe('slickbot', () => {
    let _buttUnderTest: DiscordClient;
    let _userClient: DiscordClient;
    let _lastMessage: Subject<Discord.Message> = new Subject();

    beforeAll( async () => { 
        _userClient = new DiscordClient(process.env.TEST_USER_TOKEN);
        await _userClient.init();

        _buttUnderTest = new DiscordClient();
        await _buttUnderTest.init();

        _buttUnderTest.client.on('message', (msg: Discord.Message) => {
            _lastMessage.next(msg);

            const commands = commandList.filter((command) => command.trigger(msg));
            commands.forEach((command): void => command.command(msg));
        });

    });
    
    it('ping should post pong', (done) => {
        const testChannel = findChannelByName(_userClient.client, TEST_CHANNEL)
        testChannel.send('ping');

        _lastMessage.pipe(filter(msg => msg.author.username === 'TestSlickBot')).pipe(take(1)).subscribe( msg => {
            expect(msg.content).toBe('pong');
            done();
        });
    });

    it('weather should post the weather', (done) => {
        const testChannel = findChannelByName(_userClient.client, TEST_CHANNEL)
        testChannel.send('!weather');

        _lastMessage.pipe(filter(msg => msg.author.username === 'TestSlickBot')).pipe(take(1)).subscribe( msg => {
            expect(msg.content.length > 5)
            done();
        });
    });

    it('troutslap should slap everyone', (done) => {
        const testChannel = findChannelByName(_userClient.client, TEST_CHANNEL)
        testChannel.send('!troutslap @everyone');

        _lastMessage.pipe(filter(msg => msg.author.username === 'TestSlickBot')).pipe(take(1)).subscribe( msg => {
            expect(msg.content).toContain('slaps')
            done();
        });
    });

    it('xkcd should post xkcd', (done) => {
        const testChannel = findChannelByName(_userClient.client, TEST_CHANNEL)
        testChannel.send('!xkcd');

        _lastMessage.pipe(filter(msg => msg.author.username === 'TestSlickBot')).pipe(take(1)).subscribe( msg => {
            expect(msg.content).toContain('.png')
            done();
        });
    });

    it('xkcd should post todays xkcd', (done) => {
        const testChannel = findChannelByName(_userClient.client, TEST_CHANNEL)
        testChannel.send('!xkcd today');

        _lastMessage.pipe(filter(msg => msg.author.username === 'TestSlickBot')).pipe(take(1)).subscribe( msg => {
            expect(msg.content).toContain('.png')
            done();
        });
    });

    it('help should post help', (done) => {
        const testChannel = findChannelByName(_userClient.client, TEST_CHANNEL)
        testChannel.send('!help');

        _lastMessage.pipe(filter(msg => msg.author.username === 'TestSlickBot')).pipe(take(1)).subscribe( msg => {
            expect(msg.content).toContain('!help');
            expect(msg.content).toContain('ping');
            expect(msg.content).toContain('!weather');
            expect(msg.content).toContain('!troutslap');
            expect(msg.content).toContain('xkcd');
            expect(msg.content).toContain('!meme');
            expect(msg.content).toContain('!foff');
            
            done();
        });
    });

    it('foass should f off', (done) => {
        const testChannel = findChannelByName(_userClient.client, TEST_CHANNEL)
        testChannel.send('!foff @everyone');

        _lastMessage.pipe(filter(msg => msg.author.username === 'TestSlickBot')).pipe(take(1)).subscribe( msg => {
            expect(msg.content).toContain('TestUserBot,');
            done();
        });
    });
})