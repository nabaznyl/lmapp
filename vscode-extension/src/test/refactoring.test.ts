import * as assert from 'assert';
import * as vscode from 'vscode';
import axios from 'axios';

// Mock axios for testing
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

suite('Refactoring Features', () => {
    suite('Refactor Selection', () => {
        test('should detect unused variables', async () => {
            const code = `
def hello():
    x = 5
    y = 10
    print(y)
`;
            const mockResponse = {
                data: {
                    suggestions: {
                        total_fixes: 1,
                        fixes_by_category: {
                            'unused_variable': 1,
                        },
                        fixes: [{
                            id: '1',
                            title: 'Remove unused variable x',
                            explanation: 'Variable x is assigned but never used',
                            auto_fixable: true,
                            category: 'unused_variable',
                        }],
                    },
                },
            };
            
            mockedAxios.post.mockResolvedValueOnce(mockResponse);
            
            const response = await mockedAxios.post('/v1/refactor/suggestions', {
                prompt: code,
                language: 'python',
            });
            
            assert.strictEqual(response.data.suggestions.total_fixes, 1);
            assert.strictEqual(
                Object.keys(response.data.suggestions.fixes_by_category)[0],
                'unused_variable'
            );
        });
        
        test('should detect code style issues', async () => {
            const code = `x=1+2`;
            const mockResponse = {
                data: {
                    suggestions: {
                        total_fixes: 2,
                        fixes_by_category: {
                            'whitespace': 2,
                        },
                        fixes: [
                            {
                                id: '1',
                                title: 'Add spacing around operators',
                                explanation: 'PEP 8 requires spaces around binary operators',
                                auto_fixable: true,
                                category: 'whitespace',
                            },
                        ],
                    },
                },
            };
            
            mockedAxios.post.mockResolvedValueOnce(mockResponse);
            
            const response = await mockedAxios.post('/v1/refactor/suggestions', {
                prompt: code,
                language: 'python',
            });
            
            assert.strictEqual(response.data.suggestions.total_fixes, 2);
        });
    });
    
    suite('Quick Fix Application', () => {
        test('should apply auto-fixable quick fixes', async () => {
            const originalCode = `import os\nprint("hello")`;
            const fixedCode = `print("hello")`;
            
            const mockResponse = {
                data: {
                    success: true,
                    modified_code: fixedCode,
                    applied_fixes: [{
                        id: '1',
                        title: 'Remove unused import os',
                        category: 'unused_import',
                    }],
                },
            };
            
            mockedAxios.post.mockResolvedValueOnce(mockResponse);
            
            const response = await mockedAxios.post('/v1/refactor/apply', {
                code: originalCode,
                fix_id: '1',
                language: 'python',
            });
            
            assert.strictEqual(response.data.success, true);
            assert.strictEqual(response.data.modified_code, fixedCode);
        });
        
        test('should handle fix application errors gracefully', async () => {
            mockedAxios.post.mockRejectedValueOnce(new Error('Fix application failed'));
            
            try {
                await mockedAxios.post('/v1/refactor/apply', {
                    code: 'some code',
                    fix_id: '1',
                    language: 'python',
                });
                assert.fail('Should have thrown an error');
            } catch (error: any) {
                assert.strictEqual(error.message, 'Fix application failed');
            }
        });
    });
    
    suite('Code Action Provider', () => {
        test('should return quick fixes for code actions', async () => {
            const mockResponse = {
                data: {
                    fixes: [
                        {
                            id: '1',
                            title: 'Remove unused variable',
                            explanation: 'Variable is never used',
                            auto_fixable: true,
                            category: 'style',
                        },
                        {
                            id: '2',
                            title: 'Add type annotation',
                            explanation: 'Type annotations improve code clarity',
                            auto_fixable: false,
                            category: 'type_hint',
                        },
                    ],
                },
            };
            
            mockedAxios.post.mockResolvedValueOnce(mockResponse);
            
            const response = await mockedAxios.post('/v1/refactor/quick-fixes', {
                prompt: 'x = 5',
                language: 'python',
            });
            
            const autoFixable = response.data.fixes.filter((f: any) => f.auto_fixable);
            assert.strictEqual(autoFixable.length, 1);
            assert.strictEqual(autoFixable[0].id, '1');
        });
    });
    
    suite('Multi-Language Support', () => {
        const testCases = [
            { language: 'python', code: 'x=1' },
            { language: 'javascript', code: 'var x=1;' },
            { language: 'typescript', code: 'let x: number=1;' },
        ];
        
        testCases.forEach(({ language, code }) => {
            test(`should handle ${language} code refactoring`, async () => {
                const mockResponse = {
                    data: {
                        suggestions: {
                            total_fixes: 1,
                            fixes_by_category: { 'style': 1 },
                            fixes: [],
                        },
                    },
                };
                
                mockedAxios.post.mockResolvedValueOnce(mockResponse);
                
                const response = await mockedAxios.post('/v1/refactor/suggestions', {
                    prompt: code,
                    language: language,
                });
                
                assert.ok(response.data.suggestions);
            });
        });
    });
});
