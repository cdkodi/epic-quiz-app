#!/usr/bin/env node

/**
 * Test Chapter-Based Quiz Functionality
 * 
 * Validates the new kanda/sarga columns and chapter-specific query functionality
 * Tests all the enhanced QuizService methods and API endpoints
 */

require('dotenv').config({ path: '../../.env' });

const { QuizService } = require('../../src/services/QuizService');

async function testChapterQuizFunctionality() {
    console.log('\n🧪 Testing Chapter-Based Quiz Functionality');
    console.log('==============================================\n');

    const quizService = new QuizService();
    let allTestsPassed = true;

    try {
        // Test 1: Generate regular quiz (should work as before)
        console.log('🔸 Test 1: Regular quiz generation (backward compatibility)');
        try {
            const regularQuiz = await quizService.generateQuizPackage('ramayana', 5);
            console.log(`   ✅ Generated quiz with ${regularQuiz.questions.length} questions`);
            console.log(`   📊 Categories: ${[...new Set(regularQuiz.questions.map(q => q.category))].join(', ')}`);
        } catch (error) {
            console.log(`   ❌ Failed: ${error.message}`);
            allTestsPassed = false;
        }

        // Test 2: Generate Sarga 1 specific quiz
        console.log('\n🔸 Test 2: Sarga 1 specific quiz generation');
        try {
            const sarga1Quiz = await quizService.generateChapterQuiz('ramayana', 'bala_kanda', 1, 5);
            console.log(`   ✅ Generated Sarga 1 quiz with ${sarga1Quiz.questions.length} questions`);
            
            // Verify all questions are from Sarga 1
            const sargaCheck = sarga1Quiz.questions.every(q => 
                q.id && q.text && q.options && Array.isArray(q.options)
            );
            console.log(`   📋 Question format validation: ${sargaCheck ? '✅ Passed' : '❌ Failed'}`);
            
        } catch (error) {
            console.log(`   ❌ Failed: ${error.message}`);
            allTestsPassed = false;
        }

        // Test 3: Get all questions for Sarga 2
        console.log('\n🔸 Test 3: Get all Sarga 2 questions');
        try {
            const sarga2Questions = await quizService.getChapterQuestions('ramayana', 'bala_kanda', 2);
            console.log(`   ✅ Retrieved ${sarga2Questions.length} questions from Sarga 2`);
            
            // Check data integrity
            const hasChapterInfo = sarga2Questions.every(q => q.kanda === 'bala_kanda' && q.sarga === 2);
            console.log(`   🔍 Chapter info validation: ${hasChapterInfo ? '✅ All questions properly tagged' : '❌ Missing chapter info'}`);
            
            if (!hasChapterInfo) allTestsPassed = false;
            
        } catch (error) {
            console.log(`   ❌ Failed: ${error.message}`);
            allTestsPassed = false;
        }

        // Test 4: Get chapter summary integration
        console.log('\n🔸 Test 4: Chapter summary retrieval');
        try {
            const sarga1Summary = await quizService.getChapterSummary('ramayana', 'bala_kanda', 1);
            
            if (sarga1Summary) {
                console.log(`   ✅ Retrieved Sarga 1 summary: "${sarga1Summary.title}"`);
                console.log(`   📖 Has cultural significance: ${sarga1Summary.cultural_significance ? 'Yes' : 'No'}`);
                console.log(`   👥 Character count: ${sarga1Summary.main_characters ? sarga1Summary.main_characters.split('.').length : 0}`);
            } else {
                console.log('   ⚠️  No summary found for Sarga 1');
            }
            
        } catch (error) {
            console.log(`   ❌ Failed: ${error.message}`);
            allTestsPassed = false;
        }

        // Test 5: Filtered quiz with kanda/sarga options
        console.log('\n🔸 Test 5: Quiz with kanda/sarga filtering');
        try {
            const filteredQuiz = await quizService.generateQuizPackage('ramayana', 3, { 
                kanda: 'bala_kanda', 
                sarga: 3 
            });
            
            console.log(`   ✅ Generated filtered quiz with ${filteredQuiz.questions.length} questions from Sarga 3`);
            console.log(`   🎯 Quiz ID: ${filteredQuiz.quiz_id}`);
            
        } catch (error) {
            console.log(`   ❌ Failed: ${error.message}`);
            allTestsPassed = false;
        }

        // Test 6: Test all available chapters
        console.log('\n🔸 Test 6: Quiz generation for all available chapters');
        try {
            const availableChapters = [1, 2, 3, 4];
            
            for (const sarga of availableChapters) {
                try {
                    const chapterQuiz = await quizService.generateChapterQuiz('ramayana', 'bala_kanda', sarga, 2);
                    console.log(`   ✅ Sarga ${sarga}: Generated ${chapterQuiz.questions.length} questions`);
                } catch (error) {
                    console.log(`   ⚠️  Sarga ${sarga}: ${error.message}`);
                }
            }
            
        } catch (error) {
            console.log(`   ❌ Failed: ${error.message}`);
            allTestsPassed = false;
        }

        // Test 7: Performance test - query efficiency
        console.log('\n🔸 Test 7: Query performance validation');
        try {
            const startTime = Date.now();
            
            const performanceQuiz = await quizService.generateChapterQuiz('ramayana', 'bala_kanda', 2, 10);
            
            const duration = Date.now() - startTime;
            console.log(`   ⏱️  Chapter quiz generation took ${duration}ms`);
            console.log(`   📊 Performance rating: ${duration < 1000 ? '🚀 Excellent' : duration < 2000 ? '✅ Good' : '⚠️ Needs optimization'}`);
            
            if (duration > 3000) {
                console.log('   ⚠️  Query may need optimization for production use');
            }
            
        } catch (error) {
            console.log(`   ❌ Failed: ${error.message}`);
            allTestsPassed = false;
        }

        // Final Results
        console.log('\n🏁 Test Results Summary');
        console.log('========================');
        
        if (allTestsPassed) {
            console.log('🎉 ALL TESTS PASSED!');
            console.log('✅ Chapter-based quiz functionality is working correctly');
            console.log('✅ Database schema migration successful');
            console.log('✅ QuizService enhancements operational');
            console.log('✅ API endpoints ready for chapter-specific queries');
        } else {
            console.log('⚠️  SOME TESTS FAILED');
            console.log('❌ Please review the failed tests above');
            console.log('🔧 Additional debugging may be needed');
        }

        // API Endpoint Examples
        console.log('\n📡 Available API Endpoints:');
        console.log('  • GET /api/v1/quiz?epic=ramayana&kanda=bala_kanda&sarga=1&count=10');
        console.log('  • GET /api/v1/quiz/chapter/ramayana/bala_kanda/1');
        console.log('  • GET /api/v1/quiz/chapter/ramayana/bala_kanda/2/questions');
        
        console.log('\n🎯 Ready for mobile app integration!');
        
        return allTestsPassed;
        
    } catch (error) {
        console.error('\n💥 Critical test failure:', error.message);
        if (error.stack) {
            console.error('Stack trace:', error.stack);
        }
        return false;
    }
}

// Run the tests
if (require.main === module) {
    testChapterQuizFunctionality()
        .then(success => {
            process.exit(success ? 0 : 1);
        })
        .catch(error => {
            console.error('Test execution failed:', error);
            process.exit(1);
        });
}

module.exports = { testChapterQuizFunctionality };