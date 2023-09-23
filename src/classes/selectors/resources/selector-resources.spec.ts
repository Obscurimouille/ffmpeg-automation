import { EnumComparator } from "../../../enums/enum-comparator";
import { EnumFileTypeFilter } from "../../../enums/enum-file-type-filter";
import { SelectorResources } from "./selector-resources";

describe('resourcesSelector', () => {
    const validStepSelector = ['@resources', '@resources:', '@resources:foo'];
    const invalidStepSelector = [' @resources', 'foo@resources', '@RESOURCES', '@resourcesfoo', '@resourcesresources'];

    validStepSelector.forEach((input, index) => {
        test(`Valid input test #${index + 1}`, () => {
            expect(input).toMatch(SelectorResources.REGEX);
        });
    });

    invalidStepSelector.forEach((input, index) => {
        test(`Invalid input test #${index + 1}`, () => {
            expect(input).not.toMatch(SelectorResources.REGEX);
        });
    });
});

describe('parseFileTypeParam', () => {
    test(`Valid input tests`, () => {
        expect(SelectorResources.parseFileTypeParam('all')).toBe('all');
        expect(SelectorResources.parseFileTypeParam('videos')).toBe('videos');
    });

    test(`Invalid input tests`, () => {
        expect(SelectorResources.parseFileTypeParam('fooall')).toBeUndefined();
        expect(SelectorResources.parseFileTypeParam('allbar')).toBeUndefined();
        expect(SelectorResources.parseFileTypeParam(' all ')).toBeUndefined();
    });
});

describe('parseExtensionsParam', () => {
    test(`Valid input tests`, () => {
        expect(SelectorResources.parseExtensionsParam('mp4')).toStrictEqual(['mp4']);
        expect(SelectorResources.parseExtensionsParam('mp3,avi,mkv,wav')).toStrictEqual(['mp3', 'avi', 'mkv', 'wav']);
    });

    test(`Invalid input tests`, () => {
        expect(SelectorResources.parseExtensionsParam('mp4mp3')).toBeUndefined();
        expect(SelectorResources.parseExtensionsParam('mp5')).toBeUndefined();
    });
});

describe('parseDurationParam', () => {
    test(`Valid input tests`, () => {
        expect(SelectorResources.parseDurationParam('duration<60')).toStrictEqual({
            operator: EnumComparator.LESS,
            value: 60
        });
        expect(SelectorResources.parseDurationParam('duration=0')).toStrictEqual({
            operator: EnumComparator.EQUAL,
            value: 0
        });
        expect(SelectorResources.parseDurationParam('duration>=999')).toStrictEqual({
            operator: EnumComparator.GREATER_OR_EQUAL,
            value: 999
        });
    });

    test(`Invalid input tests`, () => {
        expect(SelectorResources.parseDurationParam('duration<-1')).toBeUndefined();
        expect(SelectorResources.parseDurationParam('duration==0')).toBeUndefined();
        expect(SelectorResources.parseDurationParam('duration=>999')).toBeUndefined();
    });
});

test('filter', async () => {
    const input1 = await SelectorResources.filter([
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

    const input2 = await SelectorResources.filter([
        'folder/foo.mp4',
        'folder/foo.mp3',
        'folder/foo.mkv',
    ], {
        fileType: EnumFileTypeFilter.AUDIOS,
    });
    expect(input2).toStrictEqual([
        'folder/foo.mp3',
    ]);

    const input3 = await SelectorResources.filter([
        'folder/foo.mp4',
        'folder/foo.mkv',
    ], {
        fileType: EnumFileTypeFilter.VIDEOS,
    });
    expect(input3).toStrictEqual([
        'folder/foo.mp4',
        'folder/foo.mkv',
    ]);

    const input4 = await SelectorResources.filter([
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
    expect(SelectorResources.compare(10, EnumComparator.EQUAL, 10)).toBeTruthy();
    expect(SelectorResources.compare(10, EnumComparator.GREATER, 9)).toBeTruthy();
    expect(SelectorResources.compare(10, EnumComparator.GREATER_OR_EQUAL, 10)).toBeTruthy();
    expect(SelectorResources.compare(10, EnumComparator.GREATER_OR_EQUAL, 9)).toBeTruthy();
    expect(SelectorResources.compare(10, EnumComparator.LESS, 11)).toBeTruthy();
    expect(SelectorResources.compare(10, EnumComparator.LESS_OR_EQUAL, 10)).toBeTruthy();
});