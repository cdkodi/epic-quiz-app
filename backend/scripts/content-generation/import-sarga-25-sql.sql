-- Manual SQL Migration for Sarga 25 Content Import
-- Generated content: 12 standard questions + 3 hard questions + 1 summary
-- Total: 15 questions + 1 summary

BEGIN;

-- Insert Summary for Sarga 25
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
    25,
    'The Story of Tataka and the Call to Duty',
    'Sage Vishvamitra narrates the birth, marriage, and curse of demoness Tataka; Tataka and her son Mareecha attempt to retaliate against Sage Agastya after the death of Sunda; Sage Vishvamitra urges Rama to eliminate Tataka, despite her being a woman',
    'Rama - The seventh avatar of Lord Vishnu, known for his righteousness and valor; Sage Vishvamitra - A revered sage who guides Rama and Lakshmana; Tataka - A Yakshini (female nature spirit) turned demoness due to a curse; Mareecha - Tataka''s son, who later becomes a significant adversary in the Ramayana',
    'Dharma (righteousness) and its complexities when dealing with threats to society; The conflict between compassion and justice in royal duty; The transformation of divine beings through curses and their consequences; The role of sages in guiding and instructing princes in their duties',
    'This chapter introduces the concept that eliminating evil, even in female form, is justified for the protection of society; The narrative establishes precedents from Hindu mythology where gods and heroes have eliminated female adversaries when necessary; The story reflects the tension between traditional reverence for women and the practical necessities of governance and protection',
    'In this pivotal chapter, Sage Vishvamitra narrates the tragic story of Tataka, a Yakshini who was transformed into a fearsome demoness due to a curse by Sage Agastya. Originally blessed with the strength of a thousand elephants by Brahma, Tataka was married to Sunda and had a son named Mareecha. After Sunda''s death and their failed attempt to retaliate against Sage Agastya, both mother and son were cursed to become demons. Sage Vishvamitra instructs Rama to eliminate Tataka without hesitation, emphasizing that protecting society from evil takes precedence over concerns about harming a female. The chapter explores themes of dharma (duty), the conflict between compassion and justice, and the responsibility of rulers to protect their subjects from threats, regardless of the form those threats take.',
    'https://www.valmikiramayan.net/utf8/baala/sarga25/bala_5F25_frame.htm',
    NOW(),
    NOW()
);

-- Insert Questions for Sarga 25

-- Question 1: Multipass - Narrative Introduction & Sage Authority (Easy)
INSERT INTO questions (
    epic_id,
    kanda,
    sarga,
    category,
    difficulty,
    question_text,
    options,
    correct_answer_id,
    basic_explanation,
    original_quote,
    quote_translation,
    tags,
    cross_epic_tags,
    source_url,
    created_at,
    updated_at
) VALUES (
    'ramayana',
    'bala_kanda',
    25,
    'characters',
    'easy',
    'Who is the demoness that Sage Vishvamitra narrates about in this section?',
    '["Sita","Tataka","Ahalya","Mandodari"]'::jsonb,
    1,
    'Sage Vishvamitra narrates the story of Tataka, a demoness who was once a Yakshini but was cursed by Sage Agastya.',
    'अल्पवीर्या यदा यक्षी श्रूयते मुनिपुङ्गव | कथं नागसहस्रस्य धारयत्यबला बलम् || १-२५-२',
    'It is said that yaksha strength is trivial, and this is a yakshii, more so a female, how then this yakshii frail by her femineity can exert the strength of a thousand elephants?',
    '["Tataka","demoness","Sage Vishvamitra"]'::jsonb,
    '["character identification","narrative introduction"]'::jsonb,
    'https://www.valmikiramayan.net/utf8/baala/sarga25/bala_5F25_frame.htm',
    NOW(),
    NOW()
);

-- Question 2: Multipass - Narrative Introduction & Sage Authority (Medium)
INSERT INTO questions (
    epic_id,
    kanda,
    sarga,
    category,
    difficulty,
    question_text,
    options,
    correct_answer_id,
    basic_explanation,
    original_quote,
    quote_translation,
    tags,
    cross_epic_tags,
    source_url,
    created_at,
    updated_at
) VALUES (
    'ramayana',
    'bala_kanda',
    25,
    'culture',
    'medium',
    'What extraordinary strength was given to Tataka by Brahma?',
    '["Strength of a hundred lions","Strength of a thousand elephants","Strength of a thousand horses","Strength of the wind"]'::jsonb,
    1,
    'Brahma blessed Tataka with the strength of a thousand elephants, making her an extremely powerful being.',
    'ददौ नागसहस्रस्य बलं चास्याः पितामहः',
    'Forefather Brahma also gave the strength of a thousand elephants to her',
    '["divine blessing","supernatural strength","Brahma"]'::jsonb,
    '["divine powers","superhuman abilities"]'::jsonb,
    'https://www.valmikiramayan.net/utf8/baala/sarga25/bala_5F25_frame.htm',
    NOW(),
    NOW()
);

-- Question 3: Multipass - Narrative Introduction & Sage Authority (Medium)
INSERT INTO questions (
    epic_id,
    kanda,
    sarga,
    category,
    difficulty,
    question_text,
    options,
    correct_answer_id,
    basic_explanation,
    original_quote,
    quote_translation,
    tags,
    cross_epic_tags,
    source_url,
    created_at,
    updated_at
) VALUES (
    'ramayana',
    'bala_kanda',
    25,
    'characters',
    'medium',
    'Who was Tataka''s husband?',
    '["Sunda","Ravana","Vali","Sugriva"]'::jsonb,
    0,
    'Tataka was married to Sunda, the son of Jambha, making her a member of the demon clan through marriage.',
    'तां तु बालां विवर्धन्तीं रूपयौवनशालिनीम् | जंभपुत्राय सुन्दाय ददौ भार्यां यशस्विनीम् || १-२५-८',
    'When that bright girl is growing up into a youthful beauty her father Suketu gave her to Jambha s son Sunda as wife',
    '["Tataka","Sunda","marriage","demon clan"]'::jsonb,
    '["character relationships","family lineage"]'::jsonb,
    'https://www.valmikiramayan.net/utf8/baala/sarga25/bala_5F25_frame.htm',
    NOW(),
    NOW()
);

-- Question 4: Multipass - Narrative Introduction & Sage Authority (Hard)
INSERT INTO questions (
    epic_id,
    kanda,
    sarga,
    category,
    difficulty,
    question_text,
    options,
    correct_answer_id,
    basic_explanation,
    original_quote,
    quote_translation,
    tags,
    cross_epic_tags,
    source_url,
    created_at,
    updated_at
) VALUES (
    'ramayana',
    'bala_kanda',
    25,
    'themes',
    'hard',
    'What does the narrative structure of Tataka''s story reveal about the relationship between divine blessings and cosmic balance?',
    '["Divine blessings are always permanent and unchangeable","Divine blessings can become curses when misused, maintaining cosmic balance","Divine blessings only apply to righteous beings","Divine blessings are meaningless in the face of human action"]'::jsonb,
    1,
    'The story shows how Tataka''s divine blessing of strength from Brahma, when combined with her evil actions, necessitated divine intervention through curses to restore cosmic balance. This reflects the Hindu concept that divine gifts come with responsibility.',
    'सैषा शापकृतामर्षा ताटका क्रोधमूर्च्छिता | देशमुत्सादयत्येनमगस्त्याचरितं शुभम्',
    'Frenzied by the curse and convulsed in fury she that Tataka is thus vandalising this auspicious province, in which sage Agastya once sauntered',
    '["cosmic balance","divine justice","blessing and curse"]'::jsonb,
    '["universal principles","theological concepts"]'::jsonb,
    'https://www.valmikiramayan.net/utf8/baala/sarga25/bala_5F25_frame.htm',
    NOW(),
    NOW()
);

-- Question 5: Multipass - Dharmic Conflict & Royal Duty (Easy)
INSERT INTO questions (
    epic_id,
    kanda,
    sarga,
    category,
    difficulty,
    question_text,
    options,
    correct_answer_id,
    basic_explanation,
    original_quote,
    quote_translation,
    tags,
    cross_epic_tags,
    source_url,
    created_at,
    updated_at
) VALUES (
    'ramayana',
    'bala_kanda',
    25,
    'themes',
    'easy',
    'What is Vishvamitra instructing Rama to do regarding Tataka?',
    '["Capture her","Transform her","Eliminate her","Negotiate with her"]'::jsonb,
    2,
    'Sage Vishvamitra instructs Rama to eliminate Tataka for the welfare of cows and Brahmins, as she poses a threat to society.',
    'एनां राघवदुर्वृत्तां यक्षीं परमदारुणाम् | गोब्राह्मणहितार्थाय जहि दुष्टपराक्रमाम्',
    'She that highly atrocious one is with horrific behaviour and malefic valour, hence you shall eliminate this yakshii for the welfare of Brahmans and cows',
    '["Rama","Tataka","elimination","duty"]'::jsonb,
    '["royal duty","protection of society"]'::jsonb,
    'https://www.valmikiramayan.net/utf8/baala/sarga25/bala_5F25_frame.htm',
    NOW(),
    NOW()
);

-- Question 6: Multipass - Dharmic Conflict & Royal Duty (Medium)
INSERT INTO questions (
    epic_id,
    kanda,
    sarga,
    category,
    difficulty,
    question_text,
    options,
    correct_answer_id,
    basic_explanation,
    original_quote,
    quote_translation,
    tags,
    cross_epic_tags,
    source_url,
    created_at,
    updated_at
) VALUES (
    'ramayana',
    'bala_kanda',
    25,
    'characters',
    'medium',
    'According to Vishvamitra, who else besides Rama can eliminate Tataka?',
    '["Lakshmana","Any warrior","No one in the three worlds","The gods themselves"]'::jsonb,
    2,
    'Vishvamitra states that excepting Rama, no one in the three worlds can brave or eliminate Tataka, who is protected by the power of a curse.',
    'न हि ते स्त्रीवधकृते घृणा कार्या नरोत्तम | चातुर्वर्ण्यहितार्थाय कर्तव्यम् राजसूनुना',
    'Excepting you there is none to eliminate her who is indomitably sheathed in a curse, oh, Raghu s legatee, and none in the three worlds can possibly brave her',
    '["Rama","unique capability","divine mission"]'::jsonb,
    '["chosen hero","divine selection"]'::jsonb,
    'https://www.valmikiramayan.net/utf8/baala/sarga25/bala_5F25_frame.htm',
    NOW(),
    NOW()
);

-- Question 7: Multipass - Dharmic Conflict & Royal Duty (Medium)
INSERT INTO questions (
    epic_id,
    kanda,
    sarga,
    category,
    difficulty,
    question_text,
    options,
    correct_answer_id,
    basic_explanation,
    original_quote,
    quote_translation,
    tags,
    cross_epic_tags,
    source_url,
    created_at,
    updated_at
) VALUES (
    'ramayana',
    'bala_kanda',
    25,
    'themes',
    'medium',
    'What principle does Vishvamitra emphasize about eliminating evil beings?',
    '["Gender determines the appropriateness of action","Compassion should always take precedence","Protecting society justifies eliminating threats regardless of form","Personal preferences matter most"]'::jsonb,
    2,
    'Vishvamitra emphasizes that protecting society from evil takes precedence over concerns about the form that evil takes, including gender considerations.',
    'न हि ते स्त्रीवधकृते घृणा कार्या नरोत्तम | चातुर्वर्ण्यहितार्थाय कर्तव्यम् राजसूनुना',
    'Compassion regarding the elimination of a female is ungermane, oh, best one among men, since a prince has to effectuate it intending the welfare of four categories of society',
    '["dharma","royal duty","social protection"]'::jsonb,
    '["ethical principles","governance"]'::jsonb,
    'https://www.valmikiramayan.net/utf8/baala/sarga25/bala_5F25_frame.htm',
    NOW(),
    NOW()
);

-- Question 8: Multipass - Dharmic Conflict & Royal Duty (Hard)
INSERT INTO questions (
    epic_id,
    kanda,
    sarga,
    category,
    difficulty,
    question_text,
    options,
    correct_answer_id,
    basic_explanation,
    original_quote,
    quote_translation,
    tags,
    cross_epic_tags,
    source_url,
    created_at,
    updated_at
) VALUES (
    'ramayana',
    'bala_kanda',
    25,
    'themes',
    'hard',
    'How does the concept of "chaaturvarnyahitaarthaaya" relate to the broader Hindu understanding of royal dharma?',
    '["It refers only to the welfare of the four castes","It represents the holistic welfare of all societal categories and cosmic order","It applies only to specific religious rituals","It is limited to economic considerations"]'::jsonb,
    1,
    'The concept encompasses the welfare of all four categories of society (varna) and represents the king''s duty to maintain dharmic order for the benefit of the entire cosmic structure, not just human society.',
    'चातुर्वर्ण्यहितार्थाय कर्तव्यम् राजसूनुना',
    'intending the welfare of four categories of society is to be done effectuated',
    '["varna dharma","royal obligation","cosmic order"]'::jsonb,
    '["social philosophy","governance theory"]'::jsonb,
    'https://www.valmikiramayan.net/utf8/baala/sarga25/bala_5F25_frame.htm',
    NOW(),
    NOW()
);

-- Question 9: Multipass - Historical Precedents & Divine Sanction (Easy)
INSERT INTO questions (
    epic_id,
    kanda,
    sarga,
    category,
    difficulty,
    question_text,
    options,
    correct_answer_id,
    basic_explanation,
    original_quote,
    quote_translation,
    tags,
    cross_epic_tags,
    source_url,
    created_at,
    updated_at
) VALUES (
    'ramayana',
    'bala_kanda',
    25,
    'culture',
    'easy',
    'Which god is mentioned as having eliminated a female demon in the past?',
    '["Brahma","Vishnu","Shiva","Indra"]'::jsonb,
    3,
    'Vishvamitra mentions that Indra once eliminated Manthara, the daughter of Virochana, when she wished to annihilate earth.',
    'श्रूयते हि पुरा शक्रो विरोचनसुतां नृप | पृथिवीं हन्तुमिच्छन्तीं मन्थरामभ्यसूदयत्',
    'Oh, Rama, the protector of people, we have heard that Indra once eliminated Manthara, the daughter of Virochana, when she wished to annihilate earth',
    '["Indra","Manthara","historical precedent"]'::jsonb,
    '["divine intervention","mythological references"]'::jsonb,
    'https://www.valmikiramayan.net/utf8/baala/sarga25/bala_5F25_frame.htm',
    NOW(),
    NOW()
);

-- Question 10: Multipass - Historical Precedents & Divine Sanction (Medium)
INSERT INTO questions (
    epic_id,
    kanda,
    sarga,
    category,
    difficulty,
    question_text,
    options,
    correct_answer_id,
    basic_explanation,
    original_quote,
    quote_translation,
    tags,
    cross_epic_tags,
    source_url,
    created_at,
    updated_at
) VALUES (
    'ramayana',
    'bala_kanda',
    25,
    'culture',
    'medium',
    'What was the reason for Vishnu eliminating the wife of Sage Bhrigu?',
    '["She was causing natural disasters","She wished the world to be without a governing factor","She was attacking innocent people","She was stealing divine weapons"]'::jsonb,
    1,
    'Vishnu eliminated the wife of Sage Bhrigu because she wished for a world without Indra, meaning without a governing divine authority.',
    'विष्णुना च पुरा राम भृगुपत्नी पतिव्रता | अनिन्द्रं लोकमिच्छन्ती काव्यमाता निषूदिता',
    'And Rama, once Vishnu wiped out even the wife of sage Bhrigu and sage Shukracarya s mother when she wished the world to become one without a governing factor, namely Indra',
    '["Vishnu","Bhrigu''s wife","divine governance"]'::jsonb,
    '["cosmic order","divine authority"]'::jsonb,
    'https://www.valmikiramayan.net/utf8/baala/sarga25/bala_5F25_frame.htm',
    NOW(),
    NOW()
);

-- Question 11: Multipass - Historical Precedents & Divine Sanction (Medium)
INSERT INTO questions (
    epic_id,
    kanda,
    sarga,
    category,
    difficulty,
    question_text,
    options,
    correct_answer_id,
    basic_explanation,
    original_quote,
    quote_translation,
    tags,
    cross_epic_tags,
    source_url,
    created_at,
    updated_at
) VALUES (
    'ramayana',
    'bala_kanda',
    25,
    'themes',
    'medium',
    'According to Vishvamitra, what have many celebrated personalities done in the past?',
    '["Avoided conflict with evil beings","Eliminated females who acted unrighteously","Protected all females regardless of their actions","Negotiated with demonic forces"]'::jsonb,
    1,
    'Vishvamitra states that many great souls and celebrated personalities have eliminated females who conducted themselves with unrighteousness, establishing a precedent.',
    'एतैरन्यैश्च बहुभी राजपुत्रैर्महात्मभिः | अधर्मसहिता नार्यो हताः पुरुषसत्तमैः',
    'Oh, prince, these great souls and many other celebrated personalities have eliminated females who deported themselves with unrighteousness',
    '["historical examples","righteous action","precedent"]'::jsonb,
    '["moral exemplars","ethical precedents"]'::jsonb,
    'https://www.valmikiramayan.net/utf8/baala/sarga25/bala_5F25_frame.htm',
    NOW(),
    NOW()
);

-- Question 12: Multipass - Historical Precedents & Divine Sanction (Hard)
INSERT INTO questions (
    epic_id,
    kanda,
    sarga,
    category,
    difficulty,
    question_text,
    options,
    correct_answer_id,
    basic_explanation,
    original_quote,
    quote_translation,
    tags,
    cross_epic_tags,
    source_url,
    created_at,
    updated_at
) VALUES (
    'ramayana',
    'bala_kanda',
    25,
    'themes',
    'hard',
    'How does Vishvamitra''s citation of divine precedents function as a theological argument for dharmic action?',
    '["It simply provides historical examples without deeper meaning","It establishes divine sanction for difficult dharmic decisions through mythological authority","It suggests that gods are fallible like humans","It demonstrates that violence is always the preferred solution"]'::jsonb,
    1,
    'By citing examples of gods like Indra and Vishnu eliminating female adversaries, Vishvamitra establishes that difficult dharmic decisions have divine precedent and sanction, making Rama''s action not just permissible but divinely endorsed.',
    'तस्मादेनां घृणां त्यक्त्वा जहि मच्छासनान्नृप',
    'therefore, oh, Rama, the protector of people, by my decree you leave off compassion and eliminate her',
    '["divine precedent","theological argument","dharmic authority"]'::jsonb,
    '["religious jurisprudence","scriptural authority"]'::jsonb,
    'https://www.valmikiramayan.net/utf8/baala/sarga25/bala_5F25_frame.htm',
    NOW(),
    NOW()
);

-- Hard Questions Add-On (3 questions)

-- Hard Question 1: Character Authority and Spiritual Dynamics
INSERT INTO questions (
    epic_id,
    kanda,
    sarga,
    category,
    difficulty,
    question_text,
    options,
    correct_answer_id,
    basic_explanation,
    original_quote,
    quote_translation,
    tags,
    cross_epic_tags,
    source_url,
    created_at,
    updated_at
) VALUES (
    'ramayana',
    'bala_kanda',
    25,
    'themes',
    'hard',
    'In Sarga 25, how does Vishvamitra''s narrative technique of recounting Tataka''s genealogy and transformation demonstrate the Hindu philosophical concept of ''karma'' and its multi-generational implications, particularly in the context of divine blessings becoming instruments of destruction?',
    '["The narrative shows that karma only affects individuals, not their descendants","The narrative demonstrates how divine blessings, when combined with adharmic actions, create karmic consequences that span generations and require divine intervention to resolve","The narrative suggests that karma is irrelevant when divine blessings are involved","The narrative indicates that transformation through curses negates all previous karma"]'::jsonb,
    1,
    'Vishvamitra''s detailed account of Tataka''s lineage - from Suketu''s childless state and divine boons to Tataka''s marriage, her son''s birth, and their collective curse - illustrates how karma operates across generations. The divine blessing of strength, when combined with adharmic actions, necessitates divine intervention through curses, demonstrating that even divine gifts are subject to karmic law and cosmic balance.',
    'सैषा शापकृतामर्षा ताटका क्रोधमूर्च्छिता | देशमुत्सादयत्येनमगस्त्याचरितं शुभम् || १-२५-१४',
    'Frenzied by the curse and convulsed in fury she that Tataka is thus vandalising this auspicious province, in which sage Agastya once sauntered.',
    '["karma","multi-generational consequences","divine intervention"]'::jsonb,
    '["philosophical depth","theological concepts"]'::jsonb,
    'https://www.valmikiramayan.net/utf8/baala/sarga25/bala_5F25_frame.htm',
    NOW(),
    NOW()
);

-- Hard Question 2: Cultural Context and Dharmic Significance
INSERT INTO questions (
    epic_id,
    kanda,
    sarga,
    category,
    difficulty,
    question_text,
    options,
    correct_answer_id,
    basic_explanation,
    original_quote,
    quote_translation,
    tags,
    cross_epic_tags,
    source_url,
    created_at,
    updated_at
) VALUES (
    'ramayana',
    'bala_kanda',
    25,
    'themes',
    'hard',
    'How does Vishvamitra''s instruction to Rama regarding the elimination of Tataka reflect the tension between ''stri-himsa'' (violence against women) prohibition and ''loka-raksha'' (protection of the world) in classical Hindu dharma, and what does this reveal about the contextual nature of ethical principles?',
    '["The instruction shows that violence against women is always forbidden regardless of circumstances","The instruction demonstrates that ethical principles are absolute and never subject to contextual interpretation","The instruction reveals that dharmic principles must be weighed contextually, where protecting society from evil transcends gender-based protections","The instruction indicates that royal duty always supersedes religious ethics"]'::jsonb,
    2,
    'Vishvamitra''s lengthy justification, including citations of divine precedents (Indra eliminating Manthara, Vishnu eliminating Bhrigu''s wife), demonstrates the sophisticated Hindu understanding that dharmic principles must be interpreted contextually. The prohibition against ''stri-himsa'' yields to ''loka-raksha'' when the feminine form embodies ''adharma'' that threatens cosmic order, revealing dharma''s dynamic rather than static nature.',
    'न हि ते स्त्रीवधकृते घृणा कार्या नरोत्तम | चातुर्वर्ण्यहितार्थाय कर्तव्यम् राजसूनुना || १-२५-१७',
    'Compassion regarding the elimination of a female is ungermane, oh, best one among men, since a prince has to effectuate it intending the welfare of four categories of society.',
    '["contextual ethics","dharmic complexity","royal duty"]'::jsonb,
    '["ethical philosophy","moral reasoning"]'::jsonb,
    'https://www.valmikiramayan.net/utf8/baala/sarga25/bala_5F25_frame.htm',
    NOW(),
    NOW()
);

-- Hard Question 3: Thematic Integration and Universal Principles
INSERT INTO questions (
    epic_id,
    kanda,
    sarga,
    category,
    difficulty,
    question_text,
    options,
    correct_answer_id,
    basic_explanation,
    original_quote,
    quote_translation,
    tags,
    cross_epic_tags,
    source_url,
    created_at,
    updated_at
) VALUES (
    'ramayana',
    'bala_kanda',
    25,
    'themes',
    'hard',
    'In the broader context of the Ramayana''s dharmic framework, how does Sarga 25 establish the principle of ''aparadha-kshama'' (forgiveness of transgressions) versus ''danda-niti'' (punishment policy), and what does this suggest about the evolution of Rama''s understanding of kingship and cosmic responsibility?',
    '["The chapter advocates for unlimited forgiveness as the highest dharmic principle","The chapter suggests that punishment should be applied equally regardless of the nature of the transgression","The chapter establishes that dharmic kingship requires the wisdom to distinguish between correctable transgressions and existential threats to cosmic order","The chapter indicates that personal preferences should guide royal decisions"]'::jsonb,
    2,
    'Sarga 25 presents a nuanced dharmic teaching where Rama learns that true kingship requires discriminating wisdom (''viveka''). While ''kshama'' (forgiveness) is generally virtuous, certain transgressions against cosmic order (''adharma'' that threatens ''loka-kalyana'') require ''danda'' (punishment). This prepares Rama for his future role as ''maryada-purushottama'', one who maintains cosmic boundaries through righteous action rather than mere compassion.',
    'राज्यभारनियुक्तानामेष धर्मः सनातनः | अधर्म्यां जहि काकुत्स्थ धर्मो ह्यस्यां न विद्यते || १-२५-१९',
    'To the nominee who bears the burden of kingdom this is the age-old duty, and hence oh, Rama, the legatee of Kakutstha, eliminate this infamy, as goodness is inevident in her, isn''t it.',
    '["royal dharma","cosmic responsibility","discriminating wisdom"]'::jsonb,
    '["kingship theory","dharmic evolution"]'::jsonb,
    'https://www.valmikiramayan.net/utf8/baala/sarga25/bala_5F25_frame.htm',
    NOW(),
    NOW()
);

COMMIT;