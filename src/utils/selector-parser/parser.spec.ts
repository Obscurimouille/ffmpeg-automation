import { EnumComparator } from "../../enums/enum-comparator";
import { EnumFileTypeFilter } from "../../enums/enum-file-type-filter";
import { filter } from "./filter";
import { parseDurationParam, parseExtensionsParam, parseFileTypeParam } from "./parse";
import { compare } from "./utils";

describe('parseFileTypeParam', () => {
    test(`Valid input tests`, () => {
        expect(parseFileTypeParam('all')!.data).toBe('all');
        expect(parseFileTypeParam('videos')!.data).toBe('videos');
    });

    test(`Invalid input tests`, () => {
        expect(parseFileTypeParam('fooall')).toBeUndefined();
        expect(parseFileTypeParam('allbar')).toBeUndefined();
        expect(parseFileTypeParam(' all ')).toBeUndefined();
    });
});

describe('parseExtensionsParam', () => {
    test(`Valid input tests`, () => {
        expect(parseExtensionsParam('mp4')!.data).toStrictEqual(['mp4']);
        expect(parseExtensionsParam('mp3,avi,mkv,wav')!.data).toStrictEqual(['mp3', 'avi', 'mkv', 'wav']);
    });

    test(`Invalid input tests`, () => {
        expect(parseExtensionsParam('mp4mp3')).toBeUndefined();
        expect(parseExtensionsParam('mp5')).toBeUndefined();
    });
});

describe('parseDurationParam', () => {
    test(`Valid input tests`, () => {
        expect(parseDurationParam('duration<60')!.data).toStrictEqual({
            operator: EnumComparator.LESS,
            value: 60
        });
        expect(parseDurationParam('duration=0')!.data).toStrictEqual({
            operator: EnumComparator.EQUAL,
            value: 0
        });
        expect(parseDurationParam('duration>=999')!.data).toStrictEqual({
            operator: EnumComparator.GREATER_OR_EQUAL,
            value: 999
        });
    });

    test(`Invalid input tests`, () => {
        expect(parseDurationParam('duration<-1')).toBeUndefined();
        expect(parseDurationParam('duration==0')).toBeUndefined();
        expect(parseDurationParam('duration=>999')).toBeUndefined();
    });
});

test('filter', async () => {
    const input1 = await filter([
        'folder/foo.mp4',
        'folder/foo.mp3',
        'folder/foo.mkv',
    ], {
        fileType: EnumFileTypeFilter.ALL,
    });
    expect(input1).toStrictEqual([
        'folder/foo.mp4',
        'folder/foo.mp3',
        'folder/foo.mkv',
    ]);

    const input2 = await filter([
        'folder/foo.mp4',
        'folder/foo.mp3',
        'folder/foo.mkv',
    ], {
        fileType: EnumFileTypeFilter.AUDIOS,
    });
    expect(input2).toStrictEqual([
        'folder/foo.mp3',
    ]);

    const input3 = await filter([
        'folder/foo.mp4',
        'folder/foo.mkv',
    ], {
        fileType: EnumFileTypeFilter.VIDEOS,
    });
    expect(input3).toStrictEqual([
        'folder/foo.mp4',
        'folder/foo.mkv',
    ]);

    const input4 = await filter([
        'folder/foo.mp4',
        'folder/foo.mp3',
        'folder/foo.mkv',
    ], {
        extensions: ['mkv', 'mp3'],
    });
    expect(input4).toStrictEqual([
        'folder/foo.mp3',
        'folder/foo.mkv',
    ]);
});

describe('compare', () => {
    expect(compare(10, EnumComparator.EQUAL, 10)).toBeTruthy();
    expect(compare(10, EnumComparator.GREATER, 9)).toBeTruthy();
    expect(compare(10, EnumComparator.GREATER_OR_EQUAL, 10)).toBeTruthy();
    expect(compare(10, EnumComparator.GREATER_OR_EQUAL, 9)).toBeTruthy();
    expect(compare(10, EnumComparator.LESS, 11)).toBeTruthy();
    expect(compare(10, EnumComparator.LESS_OR_EQUAL, 10)).toBeTruthy();
});