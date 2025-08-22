Current Problem: Poor Quiz Design Architecture

     The current quiz system has fundamental educational design flaws:

     1. Random Scatter Effect

     - Questions pulled from all 77 sargas randomly
     - No narrative coherence or learning progression
     - Students get disconnected fragments instead of cohesive stories
     - Like reading random pages from a novel

     2. Content Dependency Issues

     From my analysis, I found questions that reference "previous events" and "after X happened" - proving that content HAS chronological dependencies that the random selection ignores.

     3. Thematic Incoherence

     Data shows distinct thematic blocks:
     - Sargas 1-10: Origin & Setup (avg difficulty 1.88)
     - Sargas 11-20: Vishvamitra introduction (heavy on events)
     - Sargas 21-30: Demons & Trials (character focus) 
     - Sargas 41-50: Sita Swayamvara (major story arc)
     - Sargas 71-77: Parashurama confrontation (themes heavy)

     Proposed Solution: Progressive Sarga-Block System

     Phase 1: Foundational Blocks (Easy Path)

     - Block 1: Sargas 1-5 (Origin Story) - 20 questions
     - Block 2: Sargas 6-10 (Setup Complete) - 20 questions  
     - Block 3: Sargas 11-15 (Vishvamitra Begins) - 20 questions

     Phase 2: Story Development (Medium Path)

     - Block 4: Sargas 16-25 (Journey & Trials)
     - Block 5: Sargas 26-35 (Approach to Mithila)
     - Block 6: Sargas 36-45 (Sita Introduction)

     Phase 3: Climax & Resolution (Hard Path)

     - Block 7: Sargas 46-55 (Swayamvara & Marriage)
     - Block 8: Sargas 56-65 (Post-Marriage)
     - Block 9: Sargas 66-77 (Return & Parashurama)

     Educational Benefits

     1. Narrative Coherence

     - Students follow complete story arcs
     - Context builds naturally across questions
     - "Aha moments" as story connections form

     2. Progressive Difficulty

     - Early sargas naturally easier (character intro, setup)
     - Later sargas more complex (themes, deeper meanings)
     - Matches cognitive learning progression

     3. Achievement System

     - Clear milestones ("You completed the Origin Story!")
     - Unlockable content progression
     - Natural retry points for struggling learners

     4. Cultural Context Preservation

     - Maintains epic's intended narrative flow
     - Respects traditional storytelling structure
     - Educational authenticity over artificial randomization

     Implementation Plan

     1. Quiz Flow Redesign

     Easy Quiz → Block 1 (Sargas 1-5) → 20 questions
     Medium Quiz → Block 4 (Sargas 16-25) → 20 questions  
     Hard Quiz → Block 7 (Sargas 46-55) → 20 questions

     2. Database Schema Updates

     - Add sarga_block_id field to questions
     - Create quiz_blocks table with metadata
     - Update QuizService to filter by block instead of random selection

     3. Mobile App UX Changes

     - Progress visualization by story blocks
     - "Story Mode" vs "Challenge Mode" options
     - Block completion achievements and certificates

     4. Content Balancing

     - Ensure 20+ questions per 5-sarga block
     - Maintain category distribution within blocks
     - Verify difficulty progression across blocks

     Critical Success Factors

     1. Content Audit Required

     - Verify sufficient questions in each 5-sarga block
     - Identify gaps that need additional question generation
     - Ensure quality distribution across categories

     2. User Testing

     - A/B test narrative vs random approaches
     - Measure engagement and retention differences
     - Validate educational effectiveness

     3. Fallback Strategy

     - Keep random mode as "Challenge Quiz"
     - Allow advanced users to skip blocks
     - Maintain backward compatibility

     Why This Approach is Superior

     1. Educational Psychology: Builds on prior knowledge sequentially
     2. Engagement: Story completion motivation vs arbitrary question sets  
     3. Cultural Respect: Preserves intended epic narrative structure
     4. Scalability: Works for any epic (Mahabharata blocks, etc.)
     5. Differentiation: Unique educational approach vs generic quiz apps

     The current random system treats the Ramayana like a trivia database. The block system treats it like the masterful educational epic it actually i