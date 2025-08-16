-- Complete Import for Sargas 32-33
-- Total: 24 standard questions + 6 hard questions = 30 questions + 2 summaries

-- ================================
-- CHAPTER SUMMARIES
-- ================================

-- Summary for Sarga 32
INSERT INTO chapter_summaries (
    epic_id, kanda, sarga, title, 
    key_events, main_characters, themes, 
    cultural_significance, narrative_summary,
    source_reference, generation_date
) VALUES (
    'ramayana', 'bala_kanda', 32, 'The Legend of King Kusha and His Descendants',
    '["The birth of four sons to King Kusha and his wife, a princess of Vidarbha, who were named Kushamba, Kushanabha, Adhurta, and Vasu.", "The establishment of cities by each of Kusha''s sons, with Kushamba founding Kaushambi and Kushanabha establishing Mahodaya.", "The birth of a hundred daughters to Kushanabha through the celestial maiden Ghritaachi, who were later disfigured by the wind-god Vayu."]'::jsonb,
    '["King Kusha: A great ascetic and ruler, known for his unflinching adherence to dharma (righteousness) and respect for the virtuous.", "Kushamba and Kushanabha: Sons of Kusha, who followed in their father''s footsteps and became great rulers themselves.", "The Hundred Daughters of Kushanabha: Born of celestial maiden Ghritaachi, they were known for their beauty and grace, but were later disfigured by Vayu, the wind-god."]'::jsonb,
    '["The importance of dharma (righteousness) and the consequences of its violation", "The power of asceticism and the divine boons it can bestow", "The interplay between the human and divine realms"]'::jsonb,
    'This Sarga is significant as it illustrates the Hindu concept of dharma and the consequences of its violation. The disfigurement of Kushanabha''s daughters by Vayu is a stark reminder of the repercussions of disrespecting divine entities. Furthermore, the narrative underscores the importance of asceticism, a key aspect of Hindu spirituality, as a means to attain divine boons. The establishment of cities by Kusha''s sons also reflects the cultural importance of urban development in ancient India.',
    'In this Sarga, Sage Vishvamitra narrates the legend of King Kusha, a great ascetic, who was blessed with four sons through his wife, a princess of Vidarbha. Each of these sons, Kushamba, Kushanabha, Adhurta, and Vasu, grew up to be virtuous rulers, establishing their own cities and continuing their father''s legacy. Kushamba founded the city of Kaushambi, while Kushanabha established Mahodaya. Kushanabha was further blessed with a hundred daughters through the celestial maiden Ghritaachi. These daughters were known for their beauty and grace. However, they were later disfigured by Vayu, the wind-god, as a consequence of their disrespect towards him. This event left King Kushanabha deeply perturbed, highlighting the importance of respecting divine entities and adhering to dharma.',
    'https://www.valmikiramayan.net/utf8/baala/sarga32/bala_32_frame.htm',
    '2025-08-13 16:59:37.692'
);

-- Summary for Sarga 33
INSERT INTO chapter_summaries (
    epic_id, kanda, sarga, title, 
    key_events, main_characters, themes, 
    cultural_significance, narrative_summary,
    source_reference, generation_date
) VALUES (
    'ramayana', 'bala_kanda', 33, 'Kushanaabha''s Daughters and the Air God',
    '["Kushanaabha''s hundred daughters report the mischief of the all-pervasive Air-god, who desired to dishonor them.", "Kushanaabha arranges for his daughters'' marriage with the saintly Brahmadatta.", "Somada, a celestial female, serves a sage practicing asceticism and earns his favor."]'::jsonb,
    '["Kushanaabha - A wise and scholarly king who is the father of a hundred daughters.", "Air-god - An all-pervasive deity who attempts to dishonor Kushanaabha''s daughters.", "Brahmadatta - A saintly king to whom Kushanaabha''s daughters are married.", "Somada - A celestial female who serves a sage and earns his favor."]'::jsonb,
    '["The power of Dharma (righteousness) and its role in protecting the virtuous.", "The importance of asceticism and service in earning divine favor."]'::jsonb,
    'This Sarga emphasizes the Hindu values of Dharma (righteousness), asceticism, and service. The story of Kushanaabha''s daughters and the Air-god underscores the protective power of Dharma, even against divine beings. Furthermore, the narrative of Somada serving the sage highlights the importance of selfless service and asceticism in earning divine favor. These themes are central to Hindu philosophy and culture, emphasizing the importance of moral conduct and spiritual discipline.',
    'In this Sarga, the hundred daughters of the scholarly king Kushanaabha report the mischief of the all-pervasive Air-god, who, resorting to an improper approach, desired to dishonor them. However, the Air-god is unable to overlook the virtuous conduct of the girls, demonstrating the protective power of Dharma. Pleased at their behavior, Kushanaabha arranges for their marriage with the saintly king Brahmadatta.

Meanwhile, a celestial female named Somada serves a sage practicing asceticism. Through her dedicated service, she earns the sage''s favor. This narrative underscores the importance of selfless service and asceticism in Hindu philosophy. The Sarga ends with Kushanaabha sending his daughters, now married to Brahmadatta, along with a group of religious teachers, demonstrating the importance of spiritual guidance in life''s journey.',
    'https://www.valmikiramayan.net/utf8/baala/sarga33/bala_33_frame.htm',
    '2025-08-13 17:01:49.805'
);

-- ================================
-- SARGA 32 QUESTIONS
-- ================================

-- Question 1 for Sarga 32
INSERT INTO questions (
    epic_id, kanda, sarga, category, difficulty,
    question_text, options, correct_answer_id,
    basic_explanation, original_quote, quote_translation,
    tags, cross_epic_tags, source_reference
) VALUES (
    'ramayana', 'bala_kanda', 32, 'characters', 'easy',
    'Who was the offspring of Kusha''s dynasty?',
    '["Rama","Vishvamitra","Lakshmana","Hanuman"]'::jsonb, 1,
    'Sage Vishvamitra, who is narrating the story, is the offspring of Kusha''s dynasty.',
    'ब्रह्मयोनिर्महानासीत् कुशो नाम महातपाः',
    'Brahma''s brainchild was a great ascetic named Kusha',
    '{"Kusha","Vishvamitra","dynasty"}', '{"lineage","ancestry"}',
    'https://www.valmikiramayan.net/utf8/baala/sarga32/bala_32_frame.htm'
);

-- Question 2 for Sarga 32
INSERT INTO questions (
    epic_id, kanda, sarga, category, difficulty,
    question_text, options, correct_answer_id,
    basic_explanation, original_quote, quote_translation,
    tags, cross_epic_tags, source_reference
) VALUES (
    'ramayana', 'bala_kanda', 32, 'culture', 'medium',
    'What is the significance of Kusha''s four sons in the establishment of cities?',
    '["They were the first to establish cities","Each son established a great city","They established cities as a symbol of power","They established cities to honor their father"]'::jsonb, 1,
    'Each of Kusha''s four sons established a great city, contributing to the cultural and societal development of their time.',
    'कुशाम्बस्तु महातेजाः कौशांबीमकरोत् पुरीम्',
    'The great-resplendent one, Kushamba, for his part, built the city Kaushaambi',
    '{"Kusha","cities","culture"}', '{"urbanization","civilization"}',
    'https://www.valmikiramayan.net/utf8/baala/sarga32/bala_32_frame.htm'
);

-- Question 3 for Sarga 32
INSERT INTO questions (
    epic_id, kanda, sarga, category, difficulty,
    question_text, options, correct_answer_id,
    basic_explanation, original_quote, quote_translation,
    tags, cross_epic_tags, source_reference
) VALUES (
    'ramayana', 'bala_kanda', 32, 'events', 'medium',
    'Which city was built by Kushamba?',
    '["Kaushaambi","Mahodaya","DharmaaraNya","Girivraja"]'::jsonb, 0,
    'Kushamba, one of Kusha''s sons, built the city of Kaushaambi.',
    'कुशाम्बस्तु महातेजाः कौशांबीमकरोत् पुरीम्',
    'The great-resplendent one, Kushamba, for his part, built the city Kaushaambi',
    '{"Kushamba","Kaushaambi","city"}', '{"urbanization","civilization"}',
    'https://www.valmikiramayan.net/utf8/baala/sarga32/bala_32_frame.htm'
);

-- Question 4 for Sarga 32
INSERT INTO questions (
    epic_id, kanda, sarga, category, difficulty,
    question_text, options, correct_answer_id,
    basic_explanation, original_quote, quote_translation,
    tags, cross_epic_tags, source_reference
) VALUES (
    'ramayana', 'bala_kanda', 32, 'themes', 'hard',
    'What is the symbolic significance of the establishment of cities by Kusha''s sons?',
    '["Symbol of power and dominance","Symbol of cultural and societal development","Symbol of their divine origins","Symbol of their loyalty to their father"]'::jsonb, 1,
    'The establishment of cities by Kusha''s sons symbolizes the cultural and societal development of their time, reflecting the progress of civilization.',
    'कुशाम्बस्तु महातेजाः कौशांबीमकरोत् पुरीम्',
    'The great-resplendent one, Kushamba, for his part, built the city Kaushaambi',
    '{"Kusha","cities","symbolism"}', '{"urbanization","civilization","progress"}',
    'https://www.valmikiramayan.net/utf8/baala/sarga32/bala_32_frame.htm'
);

-- Question 5 for Sarga 32
INSERT INTO questions (
    epic_id, kanda, sarga, category, difficulty,
    question_text, options, correct_answer_id,
    basic_explanation, original_quote, quote_translation,
    tags, cross_epic_tags, source_reference
) VALUES (
    'ramayana', 'bala_kanda', 32, 'characters', 'medium',
    'Who is the father of the hundred beautiful daughters in this section of the Valmiki Ramayana?',
    '["Rama","Vasu","Kushanaabha","Air-god"]'::jsonb, 2,
    'Kushanaabha is the king who fathered the hundred beautiful daughters through the celestial maiden Ghritaachi.',
    'कुशनाभस्तु राजर्षिः कन्याशतमनुत्तमम्',
    'Kushanaabha, the kingly saint, fathered a hundred unexcelled daughters.',
    '{"Kushanaabha","hundred daughters"}', '{"fatherhood","royalty"}',
    'https://www.valmikiramayan.net/utf8/baala/sarga32/bala_32_frame.htm'
);

-- Question 6 for Sarga 32
INSERT INTO questions (
    epic_id, kanda, sarga, category, difficulty,
    question_text, options, correct_answer_id,
    basic_explanation, original_quote, quote_translation,
    tags, cross_epic_tags, source_reference
) VALUES (
    'ramayana', 'bala_kanda', 32, 'events', 'hard',
    'What did the Air-god propose to Kushanaabha''s daughters?',
    '["To leave their father''s kingdom","To become his wives","To become celestial maidens","To abandon their human form"]'::jsonb, 1,
    'The Air-god, upon seeing the beauty and youthfulness of Kushanaabha''s daughters, proposed that they become his wives.',
    'अहं वः कामये सर्वा भार्या मम भविष्यथ',
    'I desire all of you to become my wives.',
    '{"Air-god","proposal"}', '{"desire","marriage"}',
    'https://www.valmikiramayan.net/utf8/baala/sarga32/bala_32_frame.htm'
);

-- Question 7 for Sarga 32
INSERT INTO questions (
    epic_id, kanda, sarga, category, difficulty,
    question_text, options, correct_answer_id,
    basic_explanation, original_quote, quote_translation,
    tags, cross_epic_tags, source_reference
) VALUES (
    'ramayana', 'bala_kanda', 32, 'themes', 'medium',
    'What is the significance of the Air-god''s proposal to Kushanaabha''s daughters?',
    '["He wanted to challenge Kushanaabha''s authority","He was attracted to their beauty and youthfulness","He wanted to test their loyalty to their father","He wanted to disrupt the peace of the kingdom"]'::jsonb, 1,
    'The Air-god was attracted to the beauty and youthfulness of Kushanaabha''s daughters, which led him to propose that they become his wives.',
    'ताः सर्वगुणसंपन्ना रूपयौवनसंयुताः',
    'Seeing them endowed with all virtues, and combined with beauty and youthfulness.',
    '{"Air-god","attraction"}', '{"desire","beauty"}',
    'https://www.valmikiramayan.net/utf8/baala/sarga32/bala_32_frame.htm'
);

-- Question 8 for Sarga 32
INSERT INTO questions (
    epic_id, kanda, sarga, category, difficulty,
    question_text, options, correct_answer_id,
    basic_explanation, original_quote, quote_translation,
    tags, cross_epic_tags, source_reference
) VALUES (
    'ramayana', 'bala_kanda', 32, 'culture', 'easy',
    'What is the cultural significance of the Air-god''s proposal to Kushanaabha''s daughters?',
    '["It represents the divine intervention in human affairs","It signifies the power of beauty and youthfulness","It symbolizes the conflict between human and divine desires","It illustrates the importance of marriage in Hindu culture"]'::jsonb, 0,
    'The Air-god''s proposal represents the divine intervention in human affairs, a common theme in Hindu epics.',
    'अहं वः कामये सर्वा भार्या मम भविष्यथ',
    'I desire all of you to become my wives.',
    '{"Air-god","divine intervention"}', '{"divinity","human affairs"}',
    'https://www.valmikiramayan.net/utf8/baala/sarga32/bala_32_frame.htm'
);

-- Question 9 for Sarga 32
INSERT INTO questions (
    epic_id, kanda, sarga, category, difficulty,
    question_text, options, correct_answer_id,
    basic_explanation, original_quote, quote_translation,
    tags, cross_epic_tags, source_reference
) VALUES (
    'ramayana', 'bala_kanda', 32, 'culture', 'medium',
    'What is the cultural significance of the daughters of Kushanaabha in the context of the divine realm?',
    '["They are considered as goddesses","They are capable of displacing a god from his realm","They are the daughters of the Air god","They are the wives of the Air god"]'::jsonb, 1,
    'In this narrative, the daughters of Kushanaabha are portrayed as powerful beings who claim to be capable of displacing a god from his realm. This reflects the complex hierarchy and dynamics within the divine realm in Hindu mythology.',
    'कुशनाभसुताः देवं समस्ता सुरसत्तम | स्थानाच्च्यावयितुं देवं रक्षामस्तु तपो वयम् || १-३२-२०',
    'We, the daughters of Kushanaabha, are capable of displacing you, the ablest divinity, from your realm.',
    '{"Kushanaabha''s daughters","divine realm"}', '{"power dynamics","divine hierarchy"}',
    'https://www.valmikiramayan.net/utf8/baala/sarga32/bala_32_frame.htm'
);

-- Question 10 for Sarga 32
INSERT INTO questions (
    epic_id, kanda, sarga, category, difficulty,
    question_text, options, correct_answer_id,
    basic_explanation, original_quote, quote_translation,
    tags, cross_epic_tags, source_reference
) VALUES (
    'ramayana', 'bala_kanda', 32, 'themes', 'hard',
    'What theme is highlighted in the daughters'' assertion of their right to choose their own groom?',
    '["Patriarchy","Matriarchy","Individual freedom","Divine intervention"]'::jsonb, 2,
    'The daughters'' assertion of their right to choose their own groom reflects the theme of individual freedom. This is significant as it challenges the traditional norms of arranged marriages in ancient Indian society.',
    'मा भूत्सकालो दुर्मेधः पितरं सत्यवादिनम् | अवमन्य स्वधर्मेण स्वयंवरमुपास्महे || १-३२-२१',
    'Do not disregard our father, the advocate of truth. We are independently selecting our groom at our liberty.',
    '{"individual freedom","choice of groom"}', '{"gender roles","marriage"}',
    'https://www.valmikiramayan.net/utf8/baala/sarga32/bala_32_frame.htm'
);

-- Question 11 for Sarga 32
INSERT INTO questions (
    epic_id, kanda, sarga, category, difficulty,
    question_text, options, correct_answer_id,
    basic_explanation, original_quote, quote_translation,
    tags, cross_epic_tags, source_reference
) VALUES (
    'ramayana', 'bala_kanda', 32, 'events', 'easy',
    'What was the consequence of the daughters'' defiance towards the Air god?',
    '["They were blessed with divine powers","They were disfigured by the Air god","They were banished from the divine realm","They were turned into goddesses"]'::jsonb, 1,
    'The daughters'' defiance towards the Air god resulted in them being disfigured by him. This reflects the theme of divine retribution in Hindu mythology.',
    'तासां तु वचनं श्रुत्वा हरिः परमकोपनः | प्रविश्य सर्वगात्राणि बभंज भगवान् प्रभुः || १-३२-२३',
    'But on hearing their sentence, the Air god, very angrily, entered all their body-parts and disfigured them.',
    '{"Air god","divine retribution"}', '{"consequences","defiance"}',
    'https://www.valmikiramayan.net/utf8/baala/sarga32/bala_32_frame.htm'
);

-- Question 12 for Sarga 32
INSERT INTO questions (
    epic_id, kanda, sarga, category, difficulty,
    question_text, options, correct_answer_id,
    basic_explanation, original_quote, quote_translation,
    tags, cross_epic_tags, source_reference
) VALUES (
    'ramayana', 'bala_kanda', 32, 'characters', 'medium',
    'What was the reaction of the king on seeing his disfigured daughters?',
    '["He was angry","He was indifferent","He was highly diffident","He was highly distressed"]'::jsonb, 3,
    'The king was highly distressed on seeing his disfigured daughters. This reflects his deep love and concern for his daughters.',
    'स च ता दयिता भग्नाः कन्याः परमशोभनाः | दृष्ट्वा दीनास्तदा राजा संभ्रांत इदमब्रवीत् || १-३२-२५',
    'Then the king, on seeing his dear and once very attractive daughters now disfigured, was highly distressed.',
    '{"king","distress"}', '{"parental love","tragedy"}',
    'https://www.valmikiramayan.net/utf8/baala/sarga32/bala_32_frame.htm'
);

-- Hard Question 1 for Sarga 32
INSERT INTO questions (
    epic_id, kanda, sarga, category, difficulty,
    question_text, options, correct_answer_id,
    basic_explanation, original_quote, quote_translation,
    tags, cross_epic_tags, source_reference
) VALUES (
    'ramayana', 'bala_kanda', 32, 'themes', 'hard',
    'In Sarga 32 of the Bala Kanda, Kusha''s four sons each establish their own cities. How does this narrative reflect the Hindu philosophical concept of Dharma and the aesthetic theory of Rasa, particularly in relation to the authority structures and spiritual dynamics of the characters?',
    '["The cities represent the four stages of life (Ashramas) in Hindu philosophy","The cities symbolize the four goals of life (Purusharthas) in Hindu philosophy","The cities embody the four types of authority (Varnas) in Hindu society","The cities reflect the four main sentiments (Rasas) in Sanskrit aesthetic theory"]'::jsonb, 1,
    'The narrative of Kusha''s sons each establishing their own cities can be interpreted as a symbolic representation of the four goals of life (Purusharthas) in Hindu philosophy: Dharma (righteousness), Artha (wealth), Kama (desire), and Moksha (liberation). Each city, and the character who establishes it, embodies one of these goals, reflecting the spiritual dynamics and authority structures within the narrative. This interpretation also aligns with the aesthetic theory of Rasa, as each city evokes a different sentiment or emotional response in the reader.',
    'स महात्मा कुलीनायां युक्तायां सुमहाबलान् | वैदर्भ्यां जनयामास चतुरः सदृशान् सुतान् || १-३२-२ कुशाम्बं कुशनाभं च अधूर्तरजसं वसुम् | दीप्तियुक्तान् महोत्साहान् क्षत्रधर्मचिकीर्षया || १-३२-३ तानुवाच कुशः',
    'The great soul Kusha begot four sons who were similar to him, with a woman of a noble family. They were Kushamba, Kushanabha, Asurataraja, and Vasu. They were radiant and full of great enthusiasm, wishing to uphold the Kshatriya Dharma.',
    '{"advanced","philosophical","scholarly"}', '{"sanskrit_poetics","hindu_philosophy","aesthetic_theory"}',
    'https://www.valmikiramayan.net/utf8/baala/sarga32/bala_32_frame.htm'
);

-- Hard Question 2 for Sarga 32
INSERT INTO questions (
    epic_id, kanda, sarga, category, difficulty,
    question_text, options, correct_answer_id,
    basic_explanation, original_quote, quote_translation,
    tags, cross_epic_tags, source_reference
) VALUES (
    'ramayana', 'bala_kanda', 32, 'themes', 'hard',
    'In the context of the verses from Valmiki Ramayana Bala Kanda Sarga 32, how does the interaction between the Air-god Vayu and Kushanabha''s daughters reflect the philosophical concept of ''Dharma'' and its implications on the cultural and societal norms of ancient India?',
    '["The interaction signifies the supremacy of divine will over human desires","The interaction represents the conflict between the pursuit of eternal youth and the acceptance of human mortality","The interaction is a metaphor for the societal expectation of women to surrender their individuality for marital obligations","The interaction is an allegory for the struggle between the transient nature of human existence and the eternal nature of divine existence"]'::jsonb, 2,
    'The interaction between Vayu and Kushanabha''s daughters is a complex representation of the societal norms and expectations placed on women in ancient India. The daughters, despite their divine beauty and eternal youth, are expected to surrender their individuality and become the wives of Vayu, reflecting the societal expectation of women to prioritize marital obligations over personal desires. This aligns with the concept of ''Dharma'' or duty, which is a central tenet of Hindu philosophy.',
    'अहं वः कामये सर्वा भार्या मम भविष्यथ | मानुषस्त्यज्यतां भावो दीर्घमायुरवाप्स्यथ || १-३२-१६',
    'I have a desire for all of you; you become my wives; leave off notion pertaining to humans; long, life, you acquire - like I have a desire for you all, hence leaving off the notions pertaining to humans, you will acquire long life.',
    '{"advanced","philosophical","scholarly"}', '{"sanskrit_poetics","hindu_philosophy","aesthetic_theory"}',
    'https://www.valmikiramayan.net/utf8/baala/sarga32/bala_32_frame.htm'
);

-- Hard Question 3 for Sarga 32
INSERT INTO questions (
    epic_id, kanda, sarga, category, difficulty,
    question_text, options, correct_answer_id,
    basic_explanation, original_quote, quote_translation,
    tags, cross_epic_tags, source_reference
) VALUES (
    'ramayana', 'bala_kanda', 32, 'themes', 'hard',
    'In the context of the verses from Bala Kanda Sarga 32, how does the narrative of the daughters of Kushanaabha and their interaction with Vayu reflect the integration of Dharma (duty/righteousness) and Svadharma (individual duty) in Hindu philosophy? How does this episode resonate with the broader themes of cosmic order and individual responsibility in the Ramayana and other Hindu texts?',
    '["The daughters'' refusal to marry Vayu represents a rejection of Dharma and Svadharma, indicating a chaotic universe","The daughters'' adherence to their father''s decision reflects the principle of Svadharma, but their punishment by Vayu suggests a violation of Dharma, indicating a tension between individual duty and cosmic order","The daughters'' adherence to their father''s decision and their punishment by Vayu both reflect the principle of Dharma, suggesting a deterministic universe","The daughters'' refusal to marry Vayu and their subsequent punishment represent a violation of both Dharma and Svadharma, indicating a universe governed by arbitrary divine will"]'::jsonb, 1,
    'The daughters'' adherence to their father''s decision, despite Vayu''s divine status, reflects the principle of Svadharma, or individual duty, which is a key aspect of Hindu philosophy. However, their punishment by Vayu can be seen as a violation of Dharma, or cosmic order, suggesting a tension between individual duty and cosmic order. This episode resonates with broader themes in the Ramayana and other Hindu texts, where characters often face dilemmas between their individual duties and the larger cosmic order.',
    'पिता हि प्रभुरस्माकं दैवतं परमं च सः | यस्य नो दास्यति पिता स नो भर्ता भविष्यति || १-३२-२२',
    'For us, our father is indeed our lord and he is the ultimate god. The one to whom our father gives us, he alone becomes our husband.',
    '{"advanced","philosophical","scholarly"}', '{"sanskrit_poetics","hindu_philosophy","aesthetic_theory"}',
    'https://www.valmikiramayan.net/utf8/baala/sarga32/bala_32_frame.htm'
);

-- ================================
-- SARGA 33 QUESTIONS
-- ================================

-- Question 1 for Sarga 33
INSERT INTO questions (
    epic_id, kanda, sarga, category, difficulty,
    question_text, options, correct_answer_id,
    basic_explanation, original_quote, quote_translation,
    tags, cross_epic_tags, source_reference
) VALUES (
    'ramayana', 'bala_kanda', 33, 'characters', 'easy',
    'Who is the king mentioned in these verses?',
    '["Rama","Kushanaabha","Vayu","Hanuman"]'::jsonb, 1,
    'In these verses, the king referred to is Kushanaabha. His daughters report to him about the advances of the Air-god, Vayu.',
    'तस्य तद्वचनं श्रुत्वा कुशनाभस्य धीमतः',
    'On hearing that sentence of the scholarly Kushanaabha',
    '{"Kushanaabha","King"}', '{"Leadership","Fatherhood"}',
    'https://www.valmikiramayan.net/utf8/baala/sarga33/bala_33_frame.htm'
);

-- Question 2 for Sarga 33
INSERT INTO questions (
    epic_id, kanda, sarga, category, difficulty,
    question_text, options, correct_answer_id,
    basic_explanation, original_quote, quote_translation,
    tags, cross_epic_tags, source_reference
) VALUES (
    'ramayana', 'bala_kanda', 33, 'themes', 'medium',
    'What virtue do the daughters of Kushanaabha demonstrate in these verses?',
    '["Courage","Humility","Forgiveness","Independence"]'::jsonb, 2,
    'The daughters of Kushanaabha demonstrate the virtue of forgiveness. Despite the improper advances of the Air-god, they maintain their dignity and forgive him.',
    'क्षान्तं क्षमावतां पुत्र्यः कर्तव्यं सुमहत्कृतम्',
    'Oh daughters, those that have self-control, their duty is forgiving; this is a very excellent deed you have done',
    '{"Forgiveness","Daughters of Kushanaabha"}', '{"Virtue","Duty"}',
    'https://www.valmikiramayan.net/utf8/baala/sarga33/bala_33_frame.htm'
);

-- Question 3 for Sarga 33
INSERT INTO questions (
    epic_id, kanda, sarga, category, difficulty,
    question_text, options, correct_answer_id,
    basic_explanation, original_quote, quote_translation,
    tags, cross_epic_tags, source_reference
) VALUES (
    'ramayana', 'bala_kanda', 33, 'events', 'medium',
    'What is the Air-god''s behavior towards the daughters of Kushanaabha?',
    '["Respectful","Indifferent","Maltreating","Protective"]'::jsonb, 2,
    'The Air-god, Vayu, is described as maltreating the daughters of Kushanaabha, resorting to an improper approach.',
    'वायुः सर्वात्मको राजन् प्रधर्षयितुमिच्छति',
    'Oh king, the all-pervasive Air-god desired to highly maltreat [dishonour us]',
    '{"Vayu","Maltreatment"}', '{"Conflict","Disrespect"}',
    'https://www.valmikiramayan.net/utf8/baala/sarga33/bala_33_frame.htm'
);

-- Question 4 for Sarga 33
INSERT INTO questions (
    epic_id, kanda, sarga, category, difficulty,
    question_text, options, correct_answer_id,
    basic_explanation, original_quote, quote_translation,
    tags, cross_epic_tags, source_reference
) VALUES (
    'ramayana', 'bala_kanda', 33, 'culture', 'hard',
    'What is the significance of the daughters touching their father''s feet with their foreheads?',
    '["A sign of disrespect","A common greeting","A sign of submission","A sign of respect and reverence"]'::jsonb, 3,
    'In Hindu culture, touching the feet of elders or respected individuals is a sign of respect and reverence. It is a way of seeking blessings.',
    'शिरोभिश्चरणौ स्पृष्ट्वा कन्याशतमभाषत',
    'The hundred girls spoke, touching [their father''s] feet with their foreheads',
    '{"Respect","Hindu Culture"}', '{"Traditions","Reverence"}',
    'https://www.valmikiramayan.net/utf8/baala/sarga33/bala_33_frame.htm'
);

-- Question 5 for Sarga 33
INSERT INTO questions (
    epic_id, kanda, sarga, category, difficulty,
    question_text, options, correct_answer_id,
    basic_explanation, original_quote, quote_translation,
    tags, cross_epic_tags, source_reference
) VALUES (
    'ramayana', 'bala_kanda', 33, 'events', 'easy',
    'Who was the celestial female serving the sage in this section of the Ramayana?',
    '["Urmila","Somada","Brahmadatta","Kushanaabha"]'::jsonb, 1,
    'In this section, the celestial female named Somada serves the sage with dedication and righteousness.',
    'सा च तं प्रणता भूत्वा शुश्रूषणपरायणा | उवास काले धर्मिष्ठा तस्यास्तुष्टोऽभवद् गुरुः || १-३३-१३',
    'She, even, in his respect, bowing down - becoming obedient, dedicated in ministering, righteously, stayed there.',
    '{"Somada","service","dedication"}', '{"devotion","righteousness"}',
    'https://www.valmikiramayan.net/utf8/baala/sarga33/bala_33_frame.htm'
);

-- Question 6 for Sarga 33
INSERT INTO questions (
    epic_id, kanda, sarga, category, difficulty,
    question_text, options, correct_answer_id,
    basic_explanation, original_quote, quote_translation,
    tags, cross_epic_tags, source_reference
) VALUES (
    'ramayana', 'bala_kanda', 33, 'culture', 'medium',
    'What does Brahmadatta request from the sage after serving him?',
    '["Wealth","A son","A kingdom","Immortality"]'::jsonb, 1,
    'Brahmadatta, after serving the sage with dedication, requests for a son who is embodied with ascetic power.',
    'ब्राह्मेण तपसा युक्तं पुत्रमिच्छामि धार्मिकम् || १-३३-१६',
    'Along with - embodied with, ascetic power, a son, I wish.',
    '{"Brahmadatta","request","son"}', '{"ascetic power","wish"}',
    'https://www.valmikiramayan.net/utf8/baala/sarga33/bala_33_frame.htm'
);

-- Question 7 for Sarga 33
INSERT INTO questions (
    epic_id, kanda, sarga, category, difficulty,
    question_text, options, correct_answer_id,
    basic_explanation, original_quote, quote_translation,
    tags, cross_epic_tags, source_reference
) VALUES (
    'ramayana', 'bala_kanda', 33, 'characters', 'medium',
    'Who is the son given to Brahmadatta by the sage?',
    '["Kushanaabha","Brahmarishi","Brahmadatta","Cuulina"]'::jsonb, 2,
    'The sage gives Brahmadatta a son who is renowned as Brahmadatta.',
    'ब्रह्मदत्त इति ख्यातं मानसं चूलिनः सुतम् || १-३३-१८',
    'Brahmadatta, thus, renowned; an instinctive son of sage Cuulina.',
    '{"Brahmadatta","son","sage"}', '{"birth","renown"}',
    'https://www.valmikiramayan.net/utf8/baala/sarga33/bala_33_frame.htm'
);

-- Question 8 for Sarga 33
INSERT INTO questions (
    epic_id, kanda, sarga, category, difficulty,
    question_text, options, correct_answer_id,
    basic_explanation, original_quote, quote_translation,
    tags, cross_epic_tags, source_reference
) VALUES (
    'ramayana', 'bala_kanda', 33, 'themes', 'hard',
    'What does the king Kushanaabha decide to do for Brahmadatta?',
    '["Give him a kingdom","Give him wealth","Give him a hundred daughters","Make him a sage"]'::jsonb, 2,
    'King Kushanaabha decides to give Brahmadatta a hundred daughters.',
    'ब्रह्मदत्ताय काकुत्स्थ दातुं कन्याशतं तदा || १-३३-२०',
    'To Brahmadatta, then, to give a hundred daughters.',
    '{"Kushanaabha","Brahmadatta","daughters"}', '{"decision","generosity"}',
    'https://www.valmikiramayan.net/utf8/baala/sarga33/bala_33_frame.htm'
);

-- Question 9 for Sarga 33
INSERT INTO questions (
    epic_id, kanda, sarga, category, difficulty,
    question_text, options, correct_answer_id,
    basic_explanation, original_quote, quote_translation,
    tags, cross_epic_tags, source_reference
) VALUES (
    'ramayana', 'bala_kanda', 33, 'themes', 'medium',
    'What is the significance of the transformation of Kushanaabha''s daughters in the context of Hindu traditions?',
    '["It signifies the divine intervention in human affairs","It represents the power of marriage in restoring beauty","It symbolizes the triumph of virtue over deformity","All of the above"]'::jsonb, 3,
    'The transformation of Kushanaabha''s daughters signifies divine intervention, the power of virtuous marriage, and the triumph of virtue over deformity. It is a common theme in Hindu mythology where divine beings intervene in human affairs to restore order and justice.',
    'स्पृष्टमात्रे ततः पाणौ विकुब्जा विगतज्वराः | युक्ताः परमया लक्ष्म्या बभुः कन्याः शतं तदा || १-३३-२३',
    'Just by touching the palm, the hundred maidens became without hunchback, their fervidity evanished, and they were endowed with supreme beauty.',
    '{"transformation","divine intervention","marriage"}', '{"universal","themes"}',
    'https://www.valmikiramayan.net/utf8/baala/sarga33/bala_33_frame.htm'
);

-- Question 10 for Sarga 33
INSERT INTO questions (
    epic_id, kanda, sarga, category, difficulty,
    question_text, options, correct_answer_id,
    basic_explanation, original_quote, quote_translation,
    tags, cross_epic_tags, source_reference
) VALUES (
    'ramayana', 'bala_kanda', 33, 'culture', 'hard',
    'What does the act of Brahmadatta taking the hands of Kushanaabha''s daughters in marriage signify in the context of Hindu wedding rituals?',
    '["It signifies the groom''s acceptance of the bride","It represents the physical union of the couple","It symbolizes the transfer of responsibility from the father to the husband","All of the above"]'::jsonb, 3,
    'In Hindu wedding rituals, the act of the groom taking the bride''s hand (Pani Grahan) signifies the groom''s acceptance of the bride, the physical union of the couple, and the transfer of responsibility from the father to the husband.',
    'यथाक्रमम् ततः पाणीन् जग्राह रघुनंदन | ब्रह्मदत्तो महीपालस्तासां देवपतिर्यथा || १-३३-२२',
    'Then, in succession, Brahmadatta, the king, took their hands like the lord of the gods.',
    '{"wedding rituals","Hindu culture","Pani Grahan"}', '{"universal","culture"}',
    'https://www.valmikiramayan.net/utf8/baala/sarga33/bala_33_frame.htm'
);

-- Question 11 for Sarga 33
INSERT INTO questions (
    epic_id, kanda, sarga, category, difficulty,
    question_text, options, correct_answer_id,
    basic_explanation, original_quote, quote_translation,
    tags, cross_epic_tags, source_reference
) VALUES (
    'ramayana', 'bala_kanda', 33, 'events', 'easy',
    'What happened when Brahmadatta touched the hands of Kushanaabha''s daughters?',
    '["They transformed into beautiful maidens","They became hunchbacked","They disappeared","They turned into divine beings"]'::jsonb, 0,
    'When Brahmadatta touched the hands of Kushanaabha''s daughters, they transformed from hunchbacked maidens into beautiful women. This signifies the transformative power of virtuous marriage.',
    'स्पृष्टमात्रे ततः पाणौ विकुब्जा विगतज्वराः | युक्ताः परमया लक्ष्म्या बभुः कन्याः शतं तदा || १-३३-२३',
    'Just by touching the palm, the hundred maidens became without hunchback, their fervidity evanished, and they were endowed with supreme beauty.',
    '{"transformation","marriage"}', '{"universal","events"}',
    'https://www.valmikiramayan.net/utf8/baala/sarga33/bala_33_frame.htm'
);

-- Question 12 for Sarga 33
INSERT INTO questions (
    epic_id, kanda, sarga, category, difficulty,
    question_text, options, correct_answer_id,
    basic_explanation, original_quote, quote_translation,
    tags, cross_epic_tags, source_reference
) VALUES (
    'ramayana', 'bala_kanda', 33, 'characters', 'medium',
    'Who was pleased to see the transformation of Kushanaabha''s daughters?',
    '["Brahmadatta","Kushanaabha","The daughters themselves","All of the above"]'::jsonb, 1,
    'Kushanaabha, the father of the hundred maidens, was highly joyful to see the transformation of his daughters. This signifies the joy and relief of a parent seeing their children''s suffering end.',
    'स दृष्ट्वा वायुना मुक्ताः कुशनाभो महीपतिः | बभूव परमप्रीतो हर्षं लेभे पुनः पुनः || १-३३-२४',
    'Seeing them released by the effect of Air-god, Kushanaabha, the lord of the land, became highly joyful and repeatedly delighted.',
    '{"Kushanaabha","joy","transformation"}', '{"universal","characters"}',
    'https://www.valmikiramayan.net/utf8/baala/sarga33/bala_33_frame.htm'
);

-- Hard Question 1 for Sarga 33
INSERT INTO questions (
    epic_id, kanda, sarga, category, difficulty,
    question_text, options, correct_answer_id,
    basic_explanation, original_quote, quote_translation,
    tags, cross_epic_tags, source_reference
) VALUES (
    'ramayana', 'bala_kanda', 33, 'themes', 'hard',
    'In Sarga 33 of the Bala Kanda, the daughters of Kushanaabha reject the advances of the Air-god, asserting their dependence on their father. How does this episode reflect the complex interplay of dharma (duty), svatantrya (independence), and spiritual authority in the context of Hindu philosophy and the broader narrative of the Ramayana?',
    '["The episode merely illustrates the patriarchal structure of ancient Indian society","The daughters'' rejection of the Air-god signifies their adherence to dharma and their respect for their father''s authority, while their dependence on their father challenges the notion of svatantrya","The episode is a critique of the Air-god''s misuse of his divine authority","The episode is an allegory for the struggle between the human and divine realms"]'::jsonb, 1,
    'The daughters'' rejection of the Air-god''s advances signifies their adherence to dharma, the moral and ethical duty, and their respect for their father''s authority. However, their dependence on their father challenges the notion of svatantrya, or independence, which is a key concept in Hindu philosophy. This episode thus presents a nuanced exploration of the interplay between dharma, svatantrya, and spiritual authority in the context of the broader narrative of the Ramayana.',
    'पितृमत्यः स्म भद्रं ते स्वच्छन्दे न वयं स्थिताः | पितरं नो वृणीष्व त्वं यदि नो दास्यते तव || १-३३-३',
    'We are father dependent; you be safe; we are not independent; us, to you; he gives, whether or not; you may request with our father.',
    '{"advanced","philosophical","scholarly"}', '{"sanskrit_poetics","hindu_philosophy","aesthetic_theory"}',
    'https://www.valmikiramayan.net/utf8/baala/sarga33/bala_33_frame.htm'
);

-- Hard Question 2 for Sarga 33
INSERT INTO questions (
    epic_id, kanda, sarga, category, difficulty,
    question_text, options, correct_answer_id,
    basic_explanation, original_quote, quote_translation,
    tags, cross_epic_tags, source_reference
) VALUES (
    'ramayana', 'bala_kanda', 33, 'themes', 'hard',
    'In the context of the verses from Valmiki Ramayana Bala Kanda Sarga 33, how does the interaction between the sage and the gandharva female reflect the dharmic principles and cultural norms of ancient India, particularly in relation to the concepts of ''dharma'', ''artha'', ''kama'', and ''moksha''?',
    '["The interaction is a mere representation of the societal norms of the time","The interaction is a symbolic representation of the four purusharthas","The interaction is a critique of the caste system","The interaction is a commentary on the role of women in society"]'::jsonb, 1,
    'The interaction between the sage and the gandharva female is a symbolic representation of the four purusharthas or the four aims of human life according to Hindu philosophy. The gandharva female''s service to the sage (dharma), the sage''s satisfaction and the gandharva female''s desire for a child (artha), the mutual respect and understanding between them (kama), and the sage''s asceticism and spiritual attainment (moksha) are all represented in this interaction.',
    'सा च तं प्रणता भूत्वा शुश्रूषणपरायणा | उवास काले धर्मिष्ठा तस्यास्तुष्टोऽभवद् गुरुः || १-३३-१३',
    'She, becoming obedient, dedicated in ministering, righteously stayed there; after some time, the mentor (the sage) became satisfied of her.',
    '{"advanced","philosophical","scholarly"}', '{"sanskrit_poetics","hindu_philosophy","aesthetic_theory"}',
    'https://www.valmikiramayan.net/utf8/baala/sarga33/bala_33_frame.htm'
);

-- Hard Question 3 for Sarga 33
INSERT INTO questions (
    epic_id, kanda, sarga, category, difficulty,
    question_text, options, correct_answer_id,
    basic_explanation, original_quote, quote_translation,
    tags, cross_epic_tags, source_reference
) VALUES (
    'ramayana', 'bala_kanda', 33, 'themes', 'hard',
    'In the context of the verses from Valmiki Ramayana Bala Kanda Sarga 33, how does the narrative of King Kushanaabha''s hundred daughters marrying Brahmadatta reflect the Hindu philosophical concept of Dharma (righteousness) and its relationship with the cosmic order (Rta)?',
    '["The marriage signifies the restoration of Dharma after the daughters'' transformation, symbolizing the reestablishment of cosmic order","The marriage is a mere social event, with no significant philosophical implications","The marriage represents the triumph of individual will over divine decree, challenging the concept of Dharma","The marriage is a metaphor for the struggle between the physical and spiritual realms"]'::jsonb, 0,
    'The narrative of King Kushanaabha''s daughters marrying Brahmadatta after their transformation signifies the restoration of Dharma, or righteousness. Their transformation from hunchbacked maidens to beautiful women upon touching Brahmadatta''s hand symbolizes the rectification of a cosmic imbalance, thus reestablishing the cosmic order, or Rta. This reflects the Hindu philosophical belief that adherence to Dharma leads to harmony with the cosmic order.',
    'स्पृष्टमात्रे ततः पाणौ विकुब्जा विगतज्वराः | युक्ताः परमया लक्ष्म्या बभुः कन्याः शतं तदा || १-३३-२३',
    'Then, just by touching his hand, the hundred maidens became free from their hunchbacked form and their desperation, endowed with supreme beauty.',
    '{"advanced","philosophical","scholarly"}', '{"sanskrit_poetics","hindu_philosophy","aesthetic_theory"}',
    'https://www.valmikiramayan.net/utf8/baala/sarga33/bala_33_frame.htm'
);