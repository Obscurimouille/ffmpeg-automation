import { FileService } from './file.service';

describe('isValidPath', () => {
    const validPaths = [
        '/path/to/valid',
        '/another_valid_path/file.txt',
        'relative_path/file.txt',
    ];

    const invalidPaths = [
        'invalid?path', // Contains an invalid character (?)
        '/path/with spaces', // Contains spaces
        123, // Not a string
    ];

    validPaths.forEach((path, index) => {
        test(`Valid path test #${index + 1} : ${path}`, () => {
            expect(FileService.isValidPath(path)).toBe(true);
        });
    });

    invalidPaths.forEach((path, index) => {
        test(`Invalid path test #${index + 1} : ${path}`, () => {
            expect(FileService.isValidPath(path)).toBe(false);
        });
    });
});

describe('isValidFilename', () => {
    const validFilenames = [
        'example.txt',
        '1.jpg',
        'my_file_name_with_underscore.txt',
    ];

    const invalidFilenames = [
        'invalid?name.txt', // Contains an invalid character (?)
        'file with spaces.txt', // Contains spaces
        123, // Not a string
    ];

    validFilenames.forEach((filename, index) => {
        test(`Valid filename test #${index + 1} : ${filename}`, () => {
            expect(FileService.isValidFilename(filename)).toBe(true);
        });
    });

    invalidFilenames.forEach((filename, index) => {
        test(`Invalid filename test #${index + 1} : ${filename}`, () => {
            expect(FileService.isValidFilename(filename)).toBe(false);
        });
    });
});
