// NOTE: regexp must have the 'g' flag or else `matchAll` will throw
function getUrls(content: string, regexp: RegExp): Array<string> {
    const urls: Array<string> = [];
    for (const matches of content.matchAll(regexp)) {
        const url = matches[0];
        urls.push(url);
    }
    return urls;
}

export const replacements: {
    [identifier: string]: (content: string) => string | null;
} = {
    '//x.com/': (content) => {
        const urls = getUrls(content, /(?:\|\|\s?)?https?:\/\/x\.com\/[^\s]+(?:\s?\|\|)?/g);
        if (urls.length > 0) {
            return urls.map((url) => url.replace('//x.com/', '//fxtwitter.com/')).join('\n');
        } else {
            return null;
        }
    },
    '//twitter.com/': (content) => {
        const urls = getUrls(content, /(?:\|\|\s?)?https?:\/\/twitter\.com\/[^\s]+(?:\s?\|\|)?/g);
        if (urls.length > 0) {
            return urls.map((url) => url.replace('//twitter.com/', '//fxtwitter.com/')).join('\n');
        } else {
            return null;
        }
    },
    '//instagram.com/': (content) => {
        const urls = getUrls(content, /(?:\|\|\s?)?https?:\/\/instagram\.com\/[^\s]+(?:\s?\|\|)?/g);
        if (urls.length > 0) {
            return urls.map((url) => url.replace('//instagram.com/', '//ddinstagram.com/')).join('\n');
        } else {
            return null;
        }
    },
    '//www.instagram.com/': (content) => {
        const urls = getUrls(content, /(?:\|\|\s?)?https?:\/\/www\.instagram\.com\/[^\s]+(?:\s?\|\|)?/g);
        if (urls.length > 0) {
            return urls.map((url) => url.replace('//www.instagram.com/', '//www.ddinstagram.com/')).join('\n');
        } else {
            return null;
        }
    },
    '//tiktok.com/': (content) => {
        const urls = getUrls(content, /(?:\|\|\s?)?https?:\/\/tiktok\.com\/[^\s]+(?:\s?\|\|)?/g);
        if (urls.length > 0) {
            return urls.map((url) => url.replace('//tiktok.com/', '//tnktok.com/')).join('\n');
        } else {
            return null;
        }
    },
    '//www.tiktok.com/': (content) => {
        const urls = getUrls(content, /(?:\|\|\s?)?https?:\/\/www\.tiktok\.com\/[^\s]+(?:\s?\|\|)?/g);
        if (urls.length > 0) {
            return urls.map((url) => url.replace('//www.tiktok.com/', '//www.tnktok.com/')).join('\n');
        } else {
            return null;
        }
    },
    '//reddit.com/': (content) => {
        const urls = getUrls(content, /(?:\|\|\s?)?https?:\/\/reddit\.com\/[^\s]+(?:\s?\|\|)?/g);
        if (urls.length > 0) {
            return urls.map((url) => url.replace('//reddit.com/', '//rxddit.com/')).join('\n');
        } else {
            return null;
        }
    },
    '//www.reddit.com/': (content) => {
        const urls = getUrls(content, /(?:\|\|\s?)?https?:\/\/www\.reddit\.com\/[^\s]+(?:\s?\|\|)?/g);
        if (urls.length > 0) {
            return urls.map((url) => url.replace('//www.reddit.com/', '//www.rxddit.com/')).join('\n');
        } else {
            return null;
        }
    }
};
