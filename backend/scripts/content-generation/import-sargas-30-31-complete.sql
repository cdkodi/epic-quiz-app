-- Complete Import for Sargas 30-31
-- Total: 24 standard questions + 6 hard questions = 30 questions + 2 summaries

BEGIN;

-- Insert Summary for Sarga 30
INSERT INTO chapter_summaries (
    epic_id,
    kanda,
    sarga,
    title,
    key_events,
    main_characters,
    themes,
    cultural_significance,
    narrative_summary,
    source_reference,
    created_at,
    updated_at
) VALUES (
    'ramayana',
    'bala_kanda',
    30,
    'The Defeat of Demons and Completion of the Yajna',
    'Rama and Lakshmana, aware of the time and place, ask Sage Vishvamitra about the exact moment the demons are expected to disrupt the ritual; As the ritual proceeds according to the hymns and rules, a frightening sound is heard in the sky, indicating the arrival of the demons; Rama and Lakshmana successfully protect the ritual from the demons, leading to the successful completion of the yajna',
    'Rama and Lakshmana: The royal princes and protectors of the ritual, who successfully defeat the demons; Sage Vishvamitra: The sage conducting the ritual, who guides Rama and Lakshmana',
    'Duty and Dharma: Rama and Lakshmana fulfill their duty as protectors, demonstrating the importance of dharma in Hindu philosophy; Triumph of Good over Evil: The successful completion of the ritual despite the demons'' attempts to disrupt it symbolizes the victory of good over evil',
    'This Sarga is significant as it showcases the importance of duty or ''dharma'' in Hindu philosophy. The princes, Rama and Lakshmana, fulfill their duty as protectors, demonstrating their commitment to righteousness. The successful completion of the yajna, despite the demons'' attempts to disrupt it, symbolizes the victory of good over evil, a recurring theme in Hindu mythology. The Sarga also highlights the power of rituals and the importance of maintaining their sanctity.',
    'In this Sarga, Rama and Lakshmana, the royal princes, are entrusted with the duty of protecting Sage Vishvamitra''s ritual from the demons. Aware of the time and place, they ask the sage about the exact moment the demons are expected to disrupt the ritual. As the ritual proceeds according to the hymns and rules, a frightening sound is heard in the sky, indicating the arrival of the demons. However, Rama and Lakshmana, prepared for this, successfully protect the ritual from the demons. Their victory leads to the successful completion of the yajna, much to the delight of Sage Vishvamitra and the other sages present. The Sarga ends with Vishvamitra expressing his gratitude to Rama and Lakshmana for their valiant efforts.',
    'https://www.valmikiramayan.net/utf8/baala/sarga30/bala_30_frame.htm',
    NOW(),
    NOW()
);

-- Insert Summary for Sarga 31
INSERT INTO chapter_summaries (
    epic_id,
    kanda,
    sarga,
    title,
    key_events,
    main_characters,
    themes,
    cultural_significance,
    narrative_summary,
    source_reference,
    created_at,
    updated_at
) VALUES (
    'ramayana',
    'bala_kanda',
    31,
    'Vishwamitra''s Journey to Mithila',
    'Rama and Lakshmana spend the night rejoicing after achieving their objectives; Vishwamitra, Rama, and Lakshmana set out for Mithila after completing their morning rituals; Vishwamitra tells Rama and Lakshmana about the auspicious bow of Shiva in Mithila and their journey towards the north begins',
    'Rama and Lakshmana - The brave and virtuous princes of Ayodhya who are accompanying Sage Vishwamitra; Vishwamitra - A revered sage with immense spiritual power, who is leading Rama and Lakshmana to Mithila',
    'Duty and Dharma - The adherence to one''s responsibilities and moral duties; Divine Destiny - The unfolding of divine plans through human actions',
    'This Sarga is significant in Hindu traditions as it sets the stage for the meeting of Rama and Sita, a divine union central to the Ramayana. It also introduces the auspicious bow of Shiva, a symbol of divine power and authority. The journey to Mithila signifies the transition from the forest life to the royal court, highlighting the duality of life in ancient Hindu society. The rituals performed by the characters underscore the importance of discipline and spiritual practices in Hinduism.',
    'In this Sarga, Rama and Lakshmana, having fulfilled their duties, spend the night in joy and satisfaction. As dawn breaks, they perform their morning rituals and prepare for the journey ahead. Sage Vishwamitra, their mentor and guide, leads them towards Mithila, the kingdom of King Janaka. He speaks of the auspicious bow of Shiva that is worshipped in Mithila, sparking curiosity and anticipation in the princes. This bow, a symbol of divine power, is beyond the reach of gods, demons, and humans alike, adding an element of challenge and adventure to their journey. As they set out towards the north, a hundred carts of followers accompany them, reflecting the respect and reverence Vishvamitra commands. Thus, the stage is set for the next chapter of their journey, filled with promise and divine destiny.',
    'https://www.valmikiramayan.net/utf8/baala/sarga31/bala_31_frame.htm',
    NOW(),
    NOW()
);

-- Insert Questions for Sarga 30

-- Question 1
INSERT INTO questions (
    epic_id, kanda, sarga, category, difficulty,
    question_text, options, correct_answer_id,
    basic_explanation, original_quote, quote_translation,
    tags, cross_epic_tags, source_reference
) VALUES (
    'ramayana', 'bala_kanda', 30, 'characters', 'easy',
    'Who are the two princes mentioned in these verses?',
    '["Rama and Lakshmana","Rama and Bharata","Lakshmana and Shatrughna","Bharata and Shatrughna"]'::jsonb, 0,
    'Rama and Lakshmana are the two princes who are safeguarding the ritual of Sage Vishvamitra.',
    'तौ तु तद्वचनं श्रुत्वा राजपुत्रौ यशस्विनौ',
    'Those two, the glorious princes, having heard that sentence...',
    '{"Rama","Lakshmana","princes"}', '{"royalty","duty"}',
    'https://www.valmikiramayan.net/utf8/baala/sarga30/bala_30_frame.htm'
);

-- Question 2
INSERT INTO questions (
    epic_id, kanda, sarga, category, difficulty,
    question_text, options, correct_answer_id,
    basic_explanation, original_quote, quote_translation,
    tags, cross_epic_tags, source_reference
) VALUES (
    'ramayana', 'bala_kanda', 30, 'events', 'medium',
    'For how long are Rama and Lakshmana supposed to safeguard the ritual?',
    '["One day and night","Three days and nights","Six days and nights","Nine days and nights"]'::jsonb, 2,
    'Rama and Lakshmana are to safeguard the ritual for six days and nights.',
    'अद्य प्रभृति षड्रात्रं रक्षतं राघवौ युवाम्',
    'Oh Raghava-s, you two, henceforth, for six nights [and days also], the ritual is to be safeguarded...',
    '{"Rama","Lakshmana","ritual","protection"}', '{"duty","vigilance"}',
    'https://www.valmikiramayan.net/utf8/baala/sarga30/bala_30_frame.htm'
);

-- Question 3
INSERT INTO questions (
    epic_id, kanda, sarga, category, difficulty,
    question_text, options, correct_answer_id,
    basic_explanation, original_quote, quote_translation,
    tags, cross_epic_tags, source_reference
) VALUES (
    'ramayana', 'bala_kanda', 30, 'themes', 'medium',
    'What is the state of Rama and Lakshmana during the six days and nights of safeguarding the ritual?',
    '["They are asleep","They are in meditation","They are wakeful","They are in a trance"]'::jsonb, 2,
    'Rama and Lakshmana are wakeful during the six days and nights, safeguarding the ritual without sleep.',
    'अनिद्रौ षडहोरात्रं तपोवनमरक्षताम्',
    'For six days and nights, without sleep, they safeguarded the ritual woodland...',
    '{"Rama","Lakshmana","wakefulness","ritual"}', '{"vigilance","duty"}',
    'https://www.valmikiramayan.net/utf8/baala/sarga30/bala_30_frame.htm'
);

-- Question 4
INSERT INTO questions (
    epic_id, kanda, sarga, category, difficulty,
    question_text, options, correct_answer_id,
    basic_explanation, original_quote, quote_translation,
    tags, cross_epic_tags, source_reference
) VALUES (
    'ramayana', 'bala_kanda', 30, 'culture', 'hard',
    'What does the term ''Nishaacarau'' refer to in the context of these verses?',
    '["The two princes","The sages","The demons","The gods"]'::jsonb, 2,
    '''Nishaacarau'' refers to the demons or night-walkers that Rama and Lakshmana are safeguarding the ritual against.',
    'भगवन् श्रोतुमिच्छावो यस्मिन्काले निशाचरौ',
    'Oh god, we two are interested to listen at which time those night-walkers are to be safeguarded...',
    '{"Nishaacarau","demons","night-walkers"}', '{"mythical creatures","demonic forces"}',
    'https://www.valmikiramayan.net/utf8/baala/sarga30/bala_30_frame.htm'
);

-- Question 5
INSERT INTO questions (
    epic_id, kanda, sarga, category, difficulty,
    question_text, options, correct_answer_id,
    basic_explanation, original_quote, quote_translation,
    tags, cross_epic_tags, source_reference
) VALUES (
    'ramayana', 'bala_kanda', 30, 'events', 'medium',
    'What action does Rama take when he notices the altar of fire being swamped with blood streams?',
    '["He runs towards the altar","He prays to the gods","He confronts the demons","He hides with Lakshmana"]'::jsonb, 0,
    'Rama, being the protector of dharma, immediately runs towards the altar to protect the ritual from being contaminated by the demons.',
    'तां तेन रुधिरौघेण वेदीं वीक्ष्य समुक्षिताम् | सहसाभिद्रुतो रामस्तानपश्यत्ततो दिवि || १-३०-१३',
    'Noticing the altar of fire being swamped with blood streams, Rama swiftly runs towards it.',
    '{"Rama","altar","ritual"}', '{"duty","protection"}',
    'https://www.valmikiramayan.net/utf8/baala/sarga30/bala_30_frame.htm'
);

-- Question 6
INSERT INTO questions (
    epic_id, kanda, sarga, category, difficulty,
    question_text, options, correct_answer_id,
    basic_explanation, original_quote, quote_translation,
    tags, cross_epic_tags, source_reference
) VALUES (
    'ramayana', 'bala_kanda', 30, 'themes', 'hard',
    'What does the attack on the ritual by Maareecha and Subaahu symbolize in the context of the Ramayana?',
    '["The struggle between good and evil","The power of divine weapons","The importance of rituals","The strength of Rama and Lakshmana"]'::jsonb, 0,
    'The attack on the ritual by the demons symbolizes the ongoing struggle between good (dharma) and evil (adharma) that is a central theme in the Ramayana.',
    'मारीचश्च सुबाहुश्च तयोरनुचरास्तथा | आगम्य भीमसंकाशा रुधिरौघानवासृजन् || १-३०-१२',
    'Monstrous in aspect, Maareecha and Subaahu, along with their followers, arrived and released streams of blood.',
    '{"Maareecha","Subaahu","attack","ritual"}', '{"good vs evil","dharma vs adharma"}',
    'https://www.valmikiramayan.net/utf8/baala/sarga30/bala_30_frame.htm'
);

-- Question 7
INSERT INTO questions (
    epic_id, kanda, sarga, category, difficulty,
    question_text, options, correct_answer_id,
    basic_explanation, original_quote, quote_translation,
    tags, cross_epic_tags, source_reference
) VALUES (
    'ramayana', 'bala_kanda', 30, 'characters', 'easy',
    'Who are the two demons that attack the ritual?',
    '["Ravana and Kumbhakarna","Maareecha and Subaahu","Vibhishana and Indrajit","Kara and Dushana"]'::jsonb, 1,
    'The two demons that attack the ritual are Maareecha and Subaahu.',
    'मारीचश्च सुबाहुश्च तयोरनुचरास्तथा | आगम्य भीमसंकाशा रुधिरौघानवासृजन् || १-३०-१२',
    'Monstrous in aspect, Maareecha and Subaahu, along with their followers, arrived and released streams of blood.',
    '{"Maareecha","Subaahu","demons"}', '{"antagonists"}',
    'https://www.valmikiramayan.net/utf8/baala/sarga30/bala_30_frame.htm'
);

-- Question 8
INSERT INTO questions (
    epic_id, kanda, sarga, category, difficulty,
    question_text, options, correct_answer_id,
    basic_explanation, original_quote, quote_translation,
    tags, cross_epic_tags, source_reference
) VALUES (
    'ramayana', 'bala_kanda', 30, 'culture', 'medium',
    'What is the significance of Rama and Lakshmana patrolling close to the Altar of Fire during the ritual?',
    '["To protect the ritual from any disruptions","To learn the process of the ritual","To show their respect for the ritual","To prepare for their future roles as kings"]'::jsonb, 0,
    'Rama and Lakshmana''s role as protectors of the ritual signifies their duty to uphold dharma and protect the sacred from any disruptions or contaminations.',
    'अथ काले गते तस्मिन् षष्ठेऽहनि तदागते | सौमित्रमब्रवीद्रामो यत्तो भव समाहितः || १-३०-७',
    'As the time elapsed and the sixth day arrived, Rama said to Soumitri (Lakshmana), ''Be prepared, you be on alert.''',
    '{"Rama","Lakshmana","ritual","protection"}', '{"duty","dharma"}',
    'https://www.valmikiramayan.net/utf8/baala/sarga30/bala_30_frame.htm'
);

-- Question 9
INSERT INTO questions (
    epic_id, kanda, sarga, category, difficulty,
    question_text, options, correct_answer_id,
    basic_explanation, original_quote, quote_translation,
    tags, cross_epic_tags, source_reference
) VALUES (
    'ramayana', 'bala_kanda', 30, 'themes', 'medium',
    'What is the significance of Rama''s victory over the demons in this section of the Ramayana?',
    '["It signifies Rama''s physical strength","It signifies Rama''s moral victory over evil","It signifies Rama''s intellectual prowess","It signifies Rama''s ascension to the throne"]'::jsonb, 1,
    'Rama''s victory over the demons is symbolic of his moral victory over evil. This is a recurring theme in the Ramayana, where Rama is often depicted as the embodiment of dharma (righteousness).',
    'स हत्वा राक्षसान् सर्वान् यज्ञघ्नान् रघुनंदनः',
    'Having slain all the demons, the delight of the Raghu dynasty',
    '{"Rama","victory","dharma"}', '{"good vs evil","moral victory"}',
    'https://www.valmikiramayan.net/utf8/baala/sarga30/bala_30_frame.htm'
);

-- Question 10
INSERT INTO questions (
    epic_id, kanda, sarga, category, difficulty,
    question_text, options, correct_answer_id,
    basic_explanation, original_quote, quote_translation,
    tags, cross_epic_tags, source_reference
) VALUES (
    'ramayana', 'bala_kanda', 30, 'culture', 'hard',
    'What does Vishvamitra''s gratitude towards Rama signify in the context of guru-shishya tradition?',
    '["It signifies the guru''s indebtedness to the shishya","It signifies the guru''s approval of the shishya''s actions","It signifies the guru''s desire for the shishya''s success","It signifies the guru''s pride in the shishya''s accomplishments"]'::jsonb, 1,
    'In the guru-shishya tradition, the guru''s approval is a significant milestone, indicating that the shishya has successfully fulfilled the guru''s expectations and teachings.',
    'कृतार्थोऽस्मि महाबाहो कृतं गुरुवचस्त्वया',
    'O mighty-armed one, I am fulfilled. You have carried out the word of your preceptor',
    '{"Vishvamitra","Rama","guru-shishya tradition"}', '{"mentorship","approval"}',
    'https://www.valmikiramayan.net/utf8/baala/sarga30/bala_30_frame.htm'
);

-- Question 11
INSERT INTO questions (
    epic_id, kanda, sarga, category, difficulty,
    question_text, options, correct_answer_id,
    basic_explanation, original_quote, quote_translation,
    tags, cross_epic_tags, source_reference
) VALUES (
    'ramayana', 'bala_kanda', 30, 'events', 'easy',
    'What happens after Rama''s victory over the demons?',
    '["Rama is crowned king","Rama is praised by the sages","Rama is banished from the kingdom","Rama is granted divine powers"]'::jsonb, 1,
    'After Rama''s victory, he is praised by the sages, much like Indra was when he was victorious.',
    'रघुनन्दनः ऋषिभिः पूजितस्तत्र यथेन्द्रो विजयी पुरा',
    'The delight of the Raghu dynasty, having slain all the demons, was worshipped there by the sages, just as Indra was when he was victorious',
    '{"Rama","victory","sages"}', '{"celebration","recognition"}',
    'https://www.valmikiramayan.net/utf8/baala/sarga30/bala_30_frame.htm'
);

-- Question 12
INSERT INTO questions (
    epic_id, kanda, sarga, category, difficulty,
    question_text, options, correct_answer_id,
    basic_explanation, original_quote, quote_translation,
    tags, cross_epic_tags, source_reference
) VALUES (
    'ramayana', 'bala_kanda', 30, 'characters', 'medium',
    'How does Rama demonstrate his dexterity in this section of the Ramayana?',
    '["By defeating the demons with a single arrow","By performing complex rituals","By using the Aagneyastra and Vaayavastra missiles","By outsmarting the demons with his wit"]'::jsonb, 2,
    'Rama demonstrates his dexterity by effectively using the Aagneyastra and Vaayavastra missiles to defeat the demons.',
    'संगृह्य सुमहच्चास्त्रमाग्नेयं रघुनंदनः',
    'Rama, the delight of the Raghu dynasty, took up the great weapon, the Aagneyastra',
    '{"Rama","dexterity","weapons"}', '{"skill","combat"}',
    'https://www.valmikiramayan.net/utf8/baala/sarga30/bala_30_frame.htm'
);

-- Insert Hard Questions for Sarga 30

-- Hard Question 1 for Sarga 30
INSERT INTO questions (
    epic_id, kanda, sarga, category, difficulty,
    question_text, options, correct_answer_id,
    basic_explanation, original_quote, quote_translation,
    tags, cross_epic_tags, source_reference
) VALUES (
    'ramayana', 'bala_kanda', 30, 'themes', 'hard',
    'In Sarga 30 of the Bala Kanda, Rama and Lakshmana are tasked with safeguarding Sage Vishvamitra''s ritual from demons. How does this event reflect the spiritual dynamics and authority structures within the context of Hindu philosophy, particularly the concept of Dharma?',
    '["It shows the princes'' duty to protect the weak and uphold righteousness","It represents the triumph of good over evil","It signifies the importance of rituals in Hinduism","All of the above"]'::jsonb, 3,
    'This event encapsulates the concept of Dharma in Hindu philosophy, where Rama and Lakshmana, as Kshatriyas, are fulfilling their duty to protect the weak and uphold righteousness. It also signifies the triumph of good over evil, a recurring theme in Hindu mythology. Furthermore, it underscores the importance of rituals in Hinduism and the need to protect them from disruption.',
    'अद्य प्रभृति षड्रात्रं रक्षतं राघवौ युवाम् | दीक्षां गतो ह्येष मुनिर्मौनित्वं च गमिष्यति || १-३०-४',
    'Oh Raghavas, from today onwards you two have to safeguard this ritual for six nights, as this sage Vishvamitra is under a vow and he will also be observing silence.',
    '{"advanced","philosophical","scholarly"}', '{"sanskrit_poetics","hindu_philosophy","aesthetic_theory"}',
    'https://www.valmikiramayan.net/utf8/baala/sarga30/bala_30_frame.htm'
);

-- Hard Question 2 for Sarga 30
INSERT INTO questions (
    epic_id, kanda, sarga, category, difficulty,
    question_text, options, correct_answer_id,
    basic_explanation, original_quote, quote_translation,
    tags, cross_epic_tags, source_reference
) VALUES (
    'ramayana', 'bala_kanda', 30, 'themes', 'hard',
    'In the context of the Valmiki Ramayana, Bala Kanda, Sarga 30, how does the ritualistic and dharmic significance of the yajna (Vedic ritual) performed by Vishvamitra and the subsequent disruption by the demons Maareecha and Subaahu reflect the philosophical concept of Dharma and Adharma in Hindu philosophy? How does this episode correlate with the broader themes of cosmic order and chaos in classical Indian literature?',
    '["The yajna represents the cosmic order (Dharma) and the demons represent chaos (Adharma), and Rama''s intervention restores the balance, reflecting the theme of cosmic order and chaos.","The yajna and the demons are mere narrative devices with no philosophical implications.","The yajna represents the demons'' power and their disruption signifies the triumph of Adharma over Dharma.","The yajna and the demons symbolize the internal conflict within Rama, with no connection to the broader themes of cosmic order and chaos."]'::jsonb, 0,
    'In Hindu philosophy, Dharma represents order, righteousness, and duty, while Adharma signifies chaos, unrighteousness, and violation of duty. The yajna, a sacred ritual, symbolizes Dharma, the cosmic order. The demons Maareecha and Subaahu, who disrupt the yajna, represent Adharma, the forces of chaos. Rama''s intervention to restore the yajna signifies the restoration of Dharma, reflecting the broader theme of cosmic order and chaos prevalent in classical Indian literature.',
    'मंत्रवच्च यथान्यायं यज्ञोऽसौ संप्रवर्तते | आकाशे च महान् शब्दः प्रादुरासीद्भयानकः || १-३०-१०',
    'That Vedic ritual, with hymnal rendering, also as per rules, while well proceeding, in the sky, a frightening strident blare is generated.',
    '{"advanced","philosophical","scholarly"}', '{"sanskrit_poetics","hindu_philosophy","aesthetic_theory"}',
    'https://www.valmikiramayan.net/utf8/baala/sarga30/bala_30_frame.htm'
);

-- Hard Question 3 for Sarga 30
INSERT INTO questions (
    epic_id, kanda, sarga, category, difficulty,
    question_text, options, correct_answer_id,
    basic_explanation, original_quote, quote_translation,
    tags, cross_epic_tags, source_reference
) VALUES (
    'ramayana', 'bala_kanda', 30, 'themes', 'hard',
    'In the context of the verses from Valmiki Ramayana Bala Kanda Sarga 30, how does Rama''s actions against the demons reflect the Hindu philosophical concept of Dharma (righteous duty) and its relationship with the cosmic order (Rta)?',
    '["Rama''s actions are purely driven by personal vengeance, reflecting the principle of ''eye for an eye''.","Rama''s actions are a manifestation of his Kshatriya duty to protect the weak and uphold righteousness, aligning with the cosmic order.","Rama''s actions are a result of his desire for power and control, reflecting the principle of ''might is right''.","Rama''s actions are driven by his desire to disrupt the cosmic order and establish a new order."]'::jsonb, 1,
    'Rama''s actions against the demons, who are described as ''ritual hinderers'' and ''abiding in evil doings'', are not driven by personal vengeance or desire for power, but by his duty as a Kshatriya to protect the weak and uphold righteousness. This aligns with the Hindu philosophical concept of Dharma, which is deeply intertwined with the cosmic order (Rta). The cosmic order is maintained when individuals perform their prescribed duties, and disrupted when evil forces, such as the demons, hinder righteous activities like rituals.',
    'निर्घृणान् दुष्टचारिणः | राक्षसान् पापकर्मस्थान् यज्ञघ्नान् रुधिराशनान् || १-३०-२१',
    'Those who are not having ruth, ill behaving one - iniquitous ones, abiding in evil doings - flagitious, ritual hinderers, blood eaters - drinkers, these demons, but, I wish to kill.',
    '{"advanced","philosophical","scholarly"}', '{"sanskrit_poetics","hindu_philosophy","aesthetic_theory"}',
    'https://www.valmikiramayan.net/utf8/baala/sarga30/bala_30_frame.htm'
);

-- Insert Questions for Sarga 31

-- Question 1
INSERT INTO questions (
    epic_id, kanda, sarga, category, difficulty,
    question_text, options, correct_answer_id,
    basic_explanation, original_quote, quote_translation,
    tags, cross_epic_tags, source_reference
) VALUES (
    'ramayana', 'bala_kanda', 31, 'events', 'easy',
    'What is the main event that the sages are planning to attend in Mithila?',
    '["A wedding","A Vedic-ritual","A coronation","A battle"]'::jsonb, 1,
    'The sages, including Vishvamitra, are planning to attend a highly righteous Vedic-ritual conducted by King Janaka of Mithila.',
    'मैथिलस्य नरश्रेष्ठ जनकस्य भविष्यति | यज्ञः परम धर्मिष्ठः तत्र यास्यामहे वयम् || १-३१-६',
    'Oh, best among men, a highly righteous Vedic-ritual of Janaka, the king of Mithila, is going to take place, and we are going there.',
    '{"Vedic-ritual","Mithila","Janaka"}', '{"rituals","sages"}',
    'https://www.valmikiramayan.net/utf8/baala/sarga31/bala_31_frame.htm'
);

-- Question 2
INSERT INTO questions (
    epic_id, kanda, sarga, category, difficulty,
    question_text, options, correct_answer_id,
    basic_explanation, original_quote, quote_translation,
    tags, cross_epic_tags, source_reference
) VALUES (
    'ramayana', 'bala_kanda', 31, 'culture', 'medium',
    'What is the significance of the divine bow that Rama is expected to see in Mithila?',
    '["It is a symbol of power","It is a weapon of destruction","It is an auspicious symbol","It is a gift from the gods"]'::jsonb, 2,
    'The divine bow of Shiva is considered an auspicious symbol and is revered in the kingdom of Mithila.',
    'अद्भुतम् च धनू रत्नम् तत्र त्वम् द्रष्टुम् अर्हसि || १-३१-७',
    'And you should see the wonderful bow-gem there.',
    '{"divine bow","Shiva","auspicious"}', '{"symbols","divine"}',
    'https://www.valmikiramayan.net/utf8/baala/sarga31/bala_31_frame.htm'
);

-- Question 3
INSERT INTO questions (
    epic_id, kanda, sarga, category, difficulty,
    question_text, options, correct_answer_id,
    basic_explanation, original_quote, quote_translation,
    tags, cross_epic_tags, source_reference
) VALUES (
    'ramayana', 'bala_kanda', 31, 'characters', 'medium',
    'Who are referred to as ''kimkarau'' or attendants in this section?',
    '["Vishvamitra and Janaka","Rama and Lakshmana","Sita and Urmila","Bharata and Shatrughna"]'::jsonb, 1,
    'Rama and Lakshmana are referred to as ''kimkarau'' or attendants, showing their humility and readiness to serve.',
    'इमौ स्म मुनि शार्दूल किंकरौ समुपस्थितौ | आज्ञापय मुनिश्रेष्ठ शासनम् करवाव किम् || १-३१-४',
    'Oh, tigerly sage, these two are your attendants and are available at your service, oh, eminent sage, order us what we have to do.',
    '{"Rama","Lakshmana","service"}', '{"humility","duty"}',
    'https://www.valmikiramayan.net/utf8/baala/sarga31/bala_31_frame.htm'
);

-- Question 4
INSERT INTO questions (
    epic_id, kanda, sarga, category, difficulty,
    question_text, options, correct_answer_id,
    basic_explanation, original_quote, quote_translation,
    tags, cross_epic_tags, source_reference
) VALUES (
    'ramayana', 'bala_kanda', 31, 'themes', 'hard',
    'What is the underlying theme of this section of the Ramayana?',
    '["Conflict and resolution","Celebration of success and preparation for a new journey","Romantic love","Betrayal and redemption"]'::jsonb, 1,
    'This section of the Ramayana focuses on the celebration of success and the preparation for a new journey to Mithila, where they will attend a Vedic-ritual and see the divine bow of Shiva.',
    'अथ ताम् रजनीम् तत्र कृतार्थौ राम लक्षणौ | ऊषतुर् मुदितौ वीरौ प्रहृष्टेन अंतरात्मना || १-३१-१',
    'Then Rama and Lakshmana, the brave ones, rejoiced and spent that night there with a well-gladdened heart, as they have achieved the purpose of their task.',
    '{"celebration","journey","success"}', '{"achievement","transition"}',
    'https://www.valmikiramayan.net/utf8/baala/sarga31/bala_31_frame.htm'
);

-- Question 5
INSERT INTO questions (
    epic_id, kanda, sarga, category, difficulty,
    question_text, options, correct_answer_id,
    basic_explanation, original_quote, quote_translation,
    tags, cross_epic_tags, source_reference
) VALUES (
    'ramayana', 'bala_kanda', 31, 'culture', 'medium',
    'What is the significance of Shiva''s bow in the Valmiki Ramayana?',
    '["It is a symbol of power and strength","It is a weapon used by Rama in his battles","It is a gift from the gods to the king of Mithila","All of the above"]'::jsonb, 0,
    'Shiva''s bow is a symbol of immense power and strength. It is so heavy that it cannot be lifted by gods, gandharvas, asuras, rakshasas, or humans. Its divine origin and the impossibility of lifting it add to its significance.',
    'न अस्य देवा न गंधर्वा न असुरा न च राक्षसाः | कर्तुम् आरोपणम् शक्ता न कथंचन मानुषाः || १-३१-९',
    'Gods, gandharvas, asuras, rakshasas, and humans are not capable of lifting this bow.',
    '{"Shiva''s bow","symbolism","power"}', '{"divine objects","strength"}',
    'https://www.valmikiramayan.net/utf8/baala/sarga31/bala_31_frame.htm'
);

-- Question 6
INSERT INTO questions (
    epic_id, kanda, sarga, category, difficulty,
    question_text, options, correct_answer_id,
    basic_explanation, original_quote, quote_translation,
    tags, cross_epic_tags, source_reference
) VALUES (
    'ramayana', 'bala_kanda', 31, 'themes', 'hard',
    'What does the inability of various beings to lift Shiva''s bow suggest about the nature of divine power in the Valmiki Ramayana?',
    '["Divine power is accessible to all","Divine power is limited to certain beings","Divine power is beyond human comprehension","Divine power can be acquired through penance"]'::jsonb, 2,
    'The fact that gods, gandharvas, asuras, rakshasas, and humans are unable to lift Shiva''s bow suggests that divine power is beyond human comprehension and is not easily accessible.',
    'न अस्य देवा न गंधर्वा न असुरा न च राक्षसाः | कर्तुम् आरोपणम् शक्ता न कथंचन मानुषाः || १-३१-９',
    'Gods, gandharvas, asuras, rakshasas, and humans are not capable of lifting this bow.',
    '{"divine power","inaccessibility","comprehension"}', '{"divine objects","limitations"}',
    'https://www.valmikiramayan.net/utf8/baala/sarga31/bala_31_frame.htm'
);

-- Question 7
INSERT INTO questions (
    epic_id, kanda, sarga, category, difficulty,
    question_text, options, correct_answer_id,
    basic_explanation, original_quote, quote_translation,
    tags, cross_epic_tags, source_reference
) VALUES (
    'ramayana', 'bala_kanda', 31, 'events', 'easy',
    'Who was the bow of Shiva given to?',
    '["Rama","Lakshmana","King of Mithila","Sita"]'::jsonb, 2,
    'The bow of Shiva was given to the king of Mithila.',
    'तद्धि यज्ञ फलम् तेन मैथिलेन उत्तमम् धनुः | याचितम् नर शार्दूल सुनाभम् सर्व दैवतैः || १-३१-१२',
    'That supreme bow, oh, man, the tiger, was requested by all gods from the king of Mithila.',
    '{"Shiva''s bow","King of Mithila"}', '{"divine objects","gifts"}',
    'https://www.valmikiramayan.net/utf8/baala/sarga31/bala_31_frame.htm'
);

-- Question 8
INSERT INTO questions (
    epic_id, kanda, sarga, category, difficulty,
    question_text, options, correct_answer_id,
    basic_explanation, original_quote, quote_translation,
    tags, cross_epic_tags, source_reference
) VALUES (
    'ramayana', 'bala_kanda', 31, 'characters', 'medium',
    'What does the term ''nara shaarduula'' used in the verses refer to?',
    '["Rama","Lakshmana","King of Mithila","Shiva"]'::jsonb, 0,
    '''Nara shaarduula'' is a term used to address Rama. It translates to ''oh, man, the tiger'' or ''oh, tigerly man'', signifying Rama''s strength and valor.',
    'तद् धनुर् नरशार्दूल मैथिलस्य महात्मनः | तत्र द्रक्ष्यसि काकुत्स्थ यज्ञम् च परम अद्भुतम् || १-३१-११',
    'Oh, tigerly man, you will see that particular bow of the great-souled king of Mithila there, and also the highly admirable Vedic ritual.',
    '{"Rama","nara shaarduula"}', '{"character traits","valor"}',
    'https://www.valmikiramayan.net/utf8/baala/sarga31/bala_31_frame.htm'
);

-- Question 9
INSERT INTO questions (
    epic_id, kanda, sarga, category, difficulty,
    question_text, options, correct_answer_id,
    basic_explanation, original_quote, quote_translation,
    tags, cross_epic_tags, source_reference
) VALUES (
    'ramayana', 'bala_kanda', 31, 'events', 'easy',
    'What does the sage Vishvamitra intend to do after leaving the hermitage?',
    '["Travel to the southern side","Travel to the northern side","Stay in the hermitage","Travel to the eastern side"]'::jsonb, 1,
    'Vishvamitra, after leaving the hermitage, intends to travel to the northern side.',
    'उत्तराम् दिशम् उद्दिश्य प्रस्थातुम् उपचक्रमे',
    'Intending to the northern side, he started to set forth',
    '{"Vishvamitra","journey","departure"}', '{"decision","direction"}',
    'https://www.valmikiramayan.net/utf8/baala/sarga31/bala_31_frame.htm'
);

-- Question 10
INSERT INTO questions (
    epic_id, kanda, sarga, category, difficulty,
    question_text, options, correct_answer_id,
    basic_explanation, original_quote, quote_translation,
    tags, cross_epic_tags, source_reference
) VALUES (
    'ramayana', 'bala_kanda', 31, 'culture', 'medium',
    'What does the term ''Brahma vaadinaam'' refer to in the context of the verse?',
    '["Followers of Lord Brahma","Advocators of Vedic principles","Worshippers of Lord Vishnu","Disciples of Sage Valmiki"]'::jsonb, 1,
    'The term ''Brahma vaadinaam'' refers to the advocators of Vedic principles.',
    'शकटी शत मात्रम् तु प्रयाणे ब्रह्म वादिनाम्',
    'Approximately a hundred carts for the journey of the advocates of Vedic principles',
    '{"Vedic principles","Brahma vaadinaam"}', '{"Vedic culture","spiritual"}',
    'https://www.valmikiramayan.net/utf8/baala/sarga31/bala_31_frame.htm'
);

-- Question 11
INSERT INTO questions (
    epic_id, kanda, sarga, category, difficulty,
    question_text, options, correct_answer_id,
    basic_explanation, original_quote, quote_translation,
    tags, cross_epic_tags, source_reference
) VALUES (
    'ramayana', 'bala_kanda', 31, 'events', 'medium',
    'Who followed Vishvamitra during his journey?',
    '["Only Rama and Lakshmana","Only the sages","Animals and birds from the hermitage","No one followed him"]'::jsonb, 2,
    'Animals and birds from the hermitage followed Vishvamitra during his journey.',
    'मृग पक्षि गणाः चैव सिद्ध आश्रम निवासिनः',
    'Animals and birds, the residents of the accomplished hermitage, followed',
    '{"Vishvamitra","journey","animals","birds"}', '{"companionship","nature"}',
    'https://www.valmikiramayan.net/utf8/baala/sarga31/bala_31_frame.htm'
);

-- Question 12
INSERT INTO questions (
    epic_id, kanda, sarga, category, difficulty,
    question_text, options, correct_answer_id,
    basic_explanation, original_quote, quote_translation,
    tags, cross_epic_tags, source_reference
) VALUES (
    'ramayana', 'bala_kanda', 31, 'culture', 'hard',
    'What does ''siddha aashramaat'' signify in the context of the verse?',
    '["A hermitage in the mountains","A hermitage by the river","A hermitage of accomplished sages","A hermitage in the forest"]'::jsonb, 2,
    '''Siddha aashramaat'' signifies a hermitage of accomplished sages.',
    'सिद्धः सिद्ध आश्रमात् अहम्',
    'I am from the Accomplished Hermitage',
    '{"hermitage","sages","accomplishment"}', '{"spiritual","place"}',
    'https://www.valmikiramayan.net/utf8/baala/sarga31/bala_31_frame.htm'
);

-- Insert Hard Questions for Sarga 31

-- Hard Question 1 for Sarga 31
INSERT INTO questions (
    epic_id, kanda, sarga, category, difficulty,
    question_text, options, correct_answer_id,
    basic_explanation, original_quote, quote_translation,
    tags, cross_epic_tags, source_reference
) VALUES (
    'ramayana', 'bala_kanda', 31, 'themes', 'hard',
    'In Sarga 31 of the Bala Kanda, Rama and Lakshmana are described as ''muditau'' (rejoicing ones) and ''viirau'' (brave ones). How does this characterization reflect the spiritual dynamics and authority structures within the narrative, and how does it connect to broader themes in Hindu philosophy and Sanskrit aesthetic theory?',
    '["The characterization emphasizes their royal status and martial prowess, aligning with the Kshatriya dharma","The characterization underscores their obedience to their guru, Vishwamitra, reflecting the guru-shishya tradition","The characterization highlights their spiritual evolution and readiness to undertake the divine mission, resonating with the concept of ''Purushartha''","All of the above"]'::jsonb, 3,
    'The characterization of Rama and Lakshmana as ''muditau'' and ''viirau'' serves multiple purposes. It emphasizes their royal status and martial prowess, aligning with the Kshatriya dharma. It underscores their obedience to their guru, Vishwamitra, reflecting the guru-shishya tradition. It also highlights their spiritual evolution and readiness to undertake the divine mission, resonating with the concept of ''Purushartha'' or the four aims of life in Hindu philosophy. This multifaceted characterization is a testament to the richness of Sanskrit literature and its ability to convey complex spiritual and philosophical concepts through character portrayal.',
    'अथ ताम् रजनीम् तत्र कृतार्थौ राम लक्षणौ | ऊषतुर् मुदितौ वीरौ प्रहृष्टेन अंतरात्मना || १-३१-१',
    'Then Rama and Lakshmana, who had achieved their purpose, stayed there that night, rejoicing and brave, with their inner souls well gladdened.',
    '{"advanced","philosophical","scholarly"}', '{"sanskrit_poetics","hindu_philosophy","aesthetic_theory"}',
    'https://www.valmikiramayan.net/utf8/baala/sarga31/bala_31_frame.htm'
);

-- Hard Question 2 for Sarga 31
INSERT INTO questions (
    epic_id, kanda, sarga, category, difficulty,
    question_text, options, correct_answer_id,
    basic_explanation, original_quote, quote_translation,
    tags, cross_epic_tags, source_reference
) VALUES (
    'ramayana', 'bala_kanda', 31, 'themes', 'hard',
    'In the context of the Valmiki Ramayana, Bala Kanda, Sarga 31, how does the inability of gods, gandharvas, asuras, rakshasas, and humans to lift the bow of Mithila king reflect the philosophical concept of Dharma and its implications in the socio-cultural fabric of ancient India?',
    '["It signifies the supremacy of divine power over earthly beings","It represents the concept of ''Karma'' and the fruits of one''s actions","It symbolizes the principle of ''Dharma'' where the bow can only be lifted by the rightful person","It illustrates the concept of ''Moksha'' or liberation from the cycle of birth and death"]'::jsonb, 2,
    'The inability of various beings to lift the bow signifies the principle of Dharma, where only the rightful person, in this case, Rama, can lift it. This reflects the socio-cultural fabric of ancient India where Dharma played a pivotal role in determining the actions and duties of individuals. The bow, being a symbol of power and authority, can only be wielded by the one who is destined to do so, thus emphasizing the importance of Dharma in the narrative.',
    'न अस्य देवा न गंधर्वा न असुरा न च राक्षसाः | कर्तुम् आरोपणम् शक्ता न कथंचन मानुषाः || १-३१-९',
    'Neither the gods, nor the gandharvas, nor the asuras, nor the rakshasas, nor the humans are capable of lifting this bow in any way.',
    '{"advanced","philosophical","scholarly"}', '{"sanskrit_poetics","hindu_philosophy","aesthetic_theory"}',
    'https://www.valmikiramayan.net/utf8/baala/sarga31/bala_31_frame.htm'
);

-- Hard Question 3 for Sarga 31
INSERT INTO questions (
    epic_id, kanda, sarga, category, difficulty,
    question_text, options, correct_answer_id,
    basic_explanation, original_quote, quote_translation,
    tags, cross_epic_tags, source_reference
) VALUES (
    'ramayana', 'bala_kanda', 31, 'themes', 'hard',
    'In the context of the verses from Valmiki Ramayana Bala Kanda Sarga 31, how does the journey of Vishvamitra and his followers reflect the concept of ''Rta'' (cosmic order) in Hindu philosophy, and how does this narrative element integrate with the broader themes of Dharma (righteousness) and Moksha (liberation)?',
    '["The journey signifies the pursuit of knowledge, which aligns with the principle of Rta, but it does not connect with the themes of Dharma and Moksha.","The journey, as a metaphor for the spiritual journey towards Moksha, aligns with the principle of Rta, and the followers'' adherence to Vishvamitra signifies the practice of Dharma.","The journey and the followers'' adherence to Vishvamitra signify the practice of Dharma, but they do not align with the principle of Rta or the theme of Moksha.","The journey does not signify the principle of Rta, but the followers'' adherence to Vishvamitra signifies the practice of Dharma and the pursuit of Moksha."]'::jsonb, 1,
    'The journey of Vishvamitra and his followers can be seen as a metaphor for the spiritual journey towards Moksha, aligning with the principle of Rta, which signifies the cosmic order and the natural flow of the universe. The followers'' adherence to Vishvamitra signifies the practice of Dharma, as they follow the righteous path under his guidance. Thus, the narrative integrates the themes of Dharma and Moksha with the principle of Rta, reflecting the interconnectedness of these concepts in Hindu philosophy.',
    'तम् व्रजंतम् मुनिवरम् अन्वगात् अनुसारिणाम् | शकटी शत मात्रम् तु प्रयाणे ब्रह्म वादिनाम् || १-३१-१७ मृग पक्षि गणाः चैव सिद्ध आश्रम निवासिनः | अनुजग्मुर् महात्मानम् विश्वामित्रम् तपोधनम् || १-३१-१८',
    'While that best saint Vishvamitra is journeying, the close followers of that Vedic advocator journeyed closely, and approximately a hundred carts are there in that journey. The animals and birds living in the hermitage of that great-souled Vishvamitra also followed him.',
    '{"advanced","philosophical","scholarly"}', '{"sanskrit_poetics","hindu_philosophy","aesthetic_theory"}',
    'https://www.valmikiramayan.net/utf8/baala/sarga31/bala_31_frame.htm'
);

COMMIT;