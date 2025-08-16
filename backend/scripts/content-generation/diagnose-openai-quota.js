#!/usr/bin/env node

/**
 * OpenAI Quota and API Status Diagnostic Tool
 * 
 * This script helps diagnose OpenAI API issues and quota problems by:
 * 1. Testing API connectivity
 * 2. Checking rate limits and quota status
 * 3. Understanding specific error types
 * 4. Providing debugging information
 */

require('dotenv').config({ path: '../../.env' });

class OpenAIQuotaDiagnostic {
    constructor() {
        this.openaiApiKey = process.env.OPENAI_API_KEY;
        
        if (!this.openaiApiKey) {
            throw new Error('OPENAI_API_KEY environment variable is required');
        }
        
        if (this.openaiApiKey.length < 20) {
            throw new Error('OPENAI_API_KEY appears to be invalid (too short)');
        }
    }

    async runDiagnostics() {
        console.log('🔍 OpenAI API Quota and Status Diagnostics');
        console.log('==========================================\n');
        
        console.log('🔑 API Key Status:');
        console.log(`   - Key length: ${this.openaiApiKey.length} characters`);
        console.log(`   - Key prefix: ${this.openaiApiKey.substring(0, 7)}...`);
        console.log(`   - Key format: ${this.openaiApiKey.startsWith('sk-') ? '✅ Valid format' : '❌ Invalid format'}\n`);

        // Test 1: Basic API connectivity
        await this.testConnectivity();
        
        // Test 2: Simple completion request to understand quota status
        await this.testSimpleCompletion();
        
        // Test 3: Get usage information if available
        await this.checkUsageInformation();
        
        // Test 4: Test with minimal request to understand rate limits
        await this.testRateLimits();
        
        console.log('\n📋 Quota Issue Identification Guide:');
        console.log('=====================================');
        this.explainQuotaErrors();
    }

    async testConnectivity() {
        console.log('🌐 Test 1: API Connectivity');
        try {
            const response = await fetch('https://api.openai.com/v1/models', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.openaiApiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log('   ✅ API connection successful');
                console.log(`   📊 Available models: ${data.data ? data.data.length : 'Unknown'}`);
                
                // Check if GPT-4 is available
                if (data.data) {
                    const gpt4Models = data.data.filter(model => model.id.includes('gpt-4'));
                    console.log(`   🤖 GPT-4 models available: ${gpt4Models.length > 0 ? '✅ Yes' : '❌ No'}`);
                    if (gpt4Models.length > 0) {
                        console.log(`      - Available models: ${gpt4Models.map(m => m.id).join(', ')}`);
                    }
                }
            } else {
                const errorData = await response.json();
                console.log('   ❌ API connection failed');
                console.log(`   🔍 Status: ${response.status} ${response.statusText}`);
                console.log(`   📄 Error: ${JSON.stringify(errorData, null, 2)}`);
                
                this.interpretError(response.status, errorData);
            }
        } catch (error) {
            console.log('   💥 Network error:', error.message);
        }
        console.log('');
    }

    async testSimpleCompletion() {
        console.log('🧪 Test 2: Simple Completion Request');
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.openaiApiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo', // Use cheaper model for testing
                    messages: [
                        { role: 'user', content: 'Hello, this is a test. Please respond with just "OK".' }
                    ],
                    max_tokens: 5,
                    temperature: 0
                })
            });

            if (response.ok) {
                const data = await response.json();
                console.log('   ✅ Simple completion successful');
                console.log(`   💬 Response: "${data.choices[0]?.message?.content || 'No response'}"`);
                console.log(`   🔢 Tokens used: ${data.usage?.total_tokens || 'Unknown'}`);
                
                // Check rate limit headers
                this.checkRateLimitHeaders(response);
            } else {
                const errorData = await response.json();
                console.log('   ❌ Completion request failed');
                console.log(`   🔍 Status: ${response.status} ${response.statusText}`);
                console.log(`   📄 Error: ${JSON.stringify(errorData, null, 2)}`);
                
                this.interpretError(response.status, errorData);
            }
        } catch (error) {
            console.log('   💥 Request error:', error.message);
        }
        console.log('');
    }

    async checkUsageInformation() {
        console.log('📊 Test 3: Usage Information');
        try {
            // Note: The usage endpoint may not be available for all API keys
            const response = await fetch('https://api.openai.com/v1/usage', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.openaiApiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log('   ✅ Usage information available');
                console.log(`   📈 Data: ${JSON.stringify(data, null, 2)}`);
            } else {
                console.log('   ⚠️  Usage endpoint not accessible (normal for some key types)');
                console.log(`   🔍 Status: ${response.status}`);
            }
        } catch (error) {
            console.log('   ⚠️  Usage check not available:', error.message);
        }
        console.log('');
    }

    async testRateLimits() {
        console.log('⚡ Test 4: Rate Limit Analysis');
        try {
            // Make a few rapid requests to understand rate limits
            const requests = [];
            for (let i = 0; i < 3; i++) {
                requests.push(
                    fetch('https://api.openai.com/v1/chat/completions', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${this.openaiApiKey}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            model: 'gpt-3.5-turbo',
                            messages: [{ role: 'user', content: `Test ${i + 1}` }],
                            max_tokens: 3
                        })
                    })
                );
            }

            const responses = await Promise.allSettled(requests);
            let successCount = 0;
            let rateLimitCount = 0;
            let quotaErrorCount = 0;

            for (const [index, result] of responses.entries()) {
                if (result.status === 'fulfilled') {
                    const response = result.value;
                    if (response.ok) {
                        successCount++;
                        if (index === 0) {
                            this.checkRateLimitHeaders(response);
                        }
                    } else {
                        if (response.status === 429) rateLimitCount++;
                        if (response.status === 402 || response.status === 403) quotaErrorCount++;
                    }
                }
            }

            console.log(`   ✅ Successful requests: ${successCount}/3`);
            console.log(`   ⚠️  Rate limited: ${rateLimitCount}/3`);
            console.log(`   ❌ Quota errors: ${quotaErrorCount}/3`);
        } catch (error) {
            console.log('   💥 Rate limit test error:', error.message);
        }
        console.log('');
    }

    checkRateLimitHeaders(response) {
        const headers = {
            'x-ratelimit-limit-requests': response.headers.get('x-ratelimit-limit-requests'),
            'x-ratelimit-remaining-requests': response.headers.get('x-ratelimit-remaining-requests'),
            'x-ratelimit-reset-requests': response.headers.get('x-ratelimit-reset-requests'),
            'x-ratelimit-limit-tokens': response.headers.get('x-ratelimit-limit-tokens'),
            'x-ratelimit-remaining-tokens': response.headers.get('x-ratelimit-remaining-tokens'),
            'x-ratelimit-reset-tokens': response.headers.get('x-ratelimit-reset-tokens')
        };

        const hasHeaders = Object.values(headers).some(h => h !== null);
        if (hasHeaders) {
            console.log('   📊 Rate Limit Information:');
            Object.entries(headers).forEach(([key, value]) => {
                if (value !== null) {
                    console.log(`      ${key}: ${value}`);
                }
            });
        }
    }

    interpretError(status, errorData) {
        console.log('\n   🔍 Error Analysis:');
        
        switch (status) {
            case 401:
                console.log('   ❌ AUTHENTICATION ERROR (401)');
                console.log('      - Your API key is invalid or has been revoked');
                console.log('      - Check your API key at: https://platform.openai.com/api-keys');
                break;
                
            case 402:
                console.log('   💰 PAYMENT/BILLING ERROR (402)');
                console.log('      - Your account has insufficient credits');
                console.log('      - Add billing information at: https://platform.openai.com/account/billing');
                break;
                
            case 403:
                console.log('   🚫 PERMISSION ERROR (403)');
                console.log('      - Your API key doesn\'t have permission to access this resource');
                console.log('      - You might not have access to GPT-4 or other premium models');
                break;
                
            case 429:
                console.log('   ⚡ RATE LIMIT ERROR (429)');
                console.log('      - You\'re making requests too quickly');
                console.log('      - Wait before making more requests');
                if (errorData.error?.type === 'insufficient_quota') {
                    console.log('      - This is specifically a QUOTA EXCEEDED error');
                    console.log('      - You\'ve used up your monthly quota');
                }
                break;
                
            case 500:
            case 502:
            case 503:
                console.log('   🔧 SERVER ERROR');
                console.log('      - OpenAI\'s servers are experiencing issues');
                console.log('      - Try again later');
                break;
                
            default:
                console.log(`   ❓ UNKNOWN ERROR (${status})`);
                console.log('      - Check OpenAI status: https://status.openai.com/');
        }
    }

    explainQuotaErrors() {
        console.log('📚 Common Quota Error Types:');
        console.log('');
        
        console.log('1. ❌ "insufficient_quota" (429 error)');
        console.log('   - You\'ve exceeded your monthly usage quota');
        console.log('   - Solution: Wait until next billing cycle or upgrade plan');
        console.log('   - Check usage at: https://platform.openai.com/account/usage');
        console.log('');
        
        console.log('2. 💰 "billing_not_active" (402 error)');
        console.log('   - No payment method on file');
        console.log('   - Solution: Add billing info at: https://platform.openai.com/account/billing');
        console.log('');
        
        console.log('3. 🚫 "access_terminated" (403 error)');
        console.log('   - Account has been suspended');
        console.log('   - Solution: Contact OpenAI support');
        console.log('');
        
        console.log('4. 🔑 "invalid_api_key" (401 error)');
        console.log('   - API key is wrong or revoked');
        console.log('   - Solution: Generate new key at: https://platform.openai.com/api-keys');
        console.log('');
        
        console.log('💡 How to Check Your Quota Status:');
        console.log('   1. Visit: https://platform.openai.com/account/usage');
        console.log('   2. Check your current month\'s usage vs limits');
        console.log('   3. Review billing settings: https://platform.openai.com/account/billing');
        console.log('   4. Consider upgrading if you need higher limits');
    }
}

// CLI Usage
async function main() {
    try {
        const diagnostic = new OpenAIQuotaDiagnostic();
        await diagnostic.runDiagnostics();
        
        console.log('\n🎯 Next Steps:');
        console.log('==============');
        console.log('1. Check https://platform.openai.com/account/usage for quota details');
        console.log('2. Review https://platform.openai.com/account/billing for payment status');
        console.log('3. If quota exceeded, wait for reset or upgrade plan');
        console.log('4. Consider using GPT-3.5-turbo for cost-effective testing');
        
    } catch (error) {
        console.error('\n💥 Diagnostic failed:', error.message);
        
        if (error.message.includes('OPENAI_API_KEY')) {
            console.error('💡 Set your API key: export OPENAI_API_KEY=your_key_here');
        }
        
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = OpenAIQuotaDiagnostic;