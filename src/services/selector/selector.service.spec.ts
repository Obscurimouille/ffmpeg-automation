import { SelectorStep } from "../../classes/selectors/selector-step";

describe('fileSelectorRegex', () => {
    const validStepSelector = ['@step-100', '@step-1', '@step-1:', '@step-1:foo'];
    const invalidStepSelector = [' @step-1', 'foo@step-1', '@step-a', '@STEP-1', '@step-1foo', '@step-1 '];

    validStepSelector.forEach((input, index) => {
        test(`Valid input test #${index + 1}`, () => {
            expect(input).toMatch(SelectorStep.REGEX);
        });
    });

    invalidStepSelector.forEach((input, index) => {
        test(`Invalid input test #${index + 1}`, () => {
            expect(input).not.toMatch(SelectorStep.REGEX);
        });
    });
});
