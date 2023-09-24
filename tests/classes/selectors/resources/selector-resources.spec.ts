import { SelectorResources } from "../../../../src/classes/selectors/resources/selector-resources";

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