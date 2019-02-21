:begin
CREATE (:`Node`:`UNIQUE IMPORT LABEL` {`active`:"true", `content`:"<p>it is an utterance with a single meaning</p>\n", `name`:"الكلمة\\n(Al Kalimah)\\nWord", `uuid`:"9f8495ad-6855-4f85-972e-aaee476001db", `UNIQUE IMPORT ID`:0});
CREATE (:`Node`:`UNIQUE IMPORT LABEL` {`active`:"true", `content`:"<p>speech in which two words or phrases are joined with a connection between them, from one to the other, so that it forms a complete statement or sentence</p>\n", `name`:"الجملة/الكلام\\n(Joomla/Kalaam)\\nSentence", `uuid`:"1ff2cda3-18ff-4b78-b0ce-29d7311ddeea", `UNIQUE IMPORT ID`:1});
CREATE (:`Node`:`UNIQUE IMPORT LABEL` {`active`:"true", `content`:"<p>speech in which two words are joined with a connection between them, from one to the other, so that it forms a incomplete or partial sentence.</p>\n", `name`:"شبه الجملة\\n(Shibhu Joomla)\\nPhrase", `uuid`:"314d4124-be44-429e-b71c-f8fb7babbec9", `UNIQUE IMPORT ID`:3});
CREATE (:`Node`:`UNIQUE IMPORT LABEL` {`active`:"true", `content`:"<p>.</p>\n", `name`:"اسم\\n(Ism)\\nNoun", `uuid`:"651b8740-b78d-4649-a755-eab385f3beab", `UNIQUE IMPORT ID`:20});
CREATE (:`Node`:`UNIQUE IMPORT LABEL` {`active`:"true", `content`:"<p>.</p>\n", `name`:"فعل\\n(Fi'l)\\nVerb", `uuid`:"1093cc3d-eb90-4da0-ad89-46993614ffd4", `UNIQUE IMPORT ID`:44});
CREATE (:`Node`:`UNIQUE IMPORT LABEL` {`active`:"true", `content`:"<p>.</p>\n", `name`:"حرف\\nHarf\\nParticle", `uuid`:"1817b638-67aa-41b3-811e-67fc19d7ae26", `UNIQUE IMPORT ID`:45});
CREATE (:`Node`:`UNIQUE IMPORT LABEL` {`active`:"true", `content`:"<h1>اللغة العربية (Al-Lugatul Arabiyah)</h1>\n\n<h1>The Arabic Language</h1>\n\n<p><strong>Arabic (العربية) </strong>is a Semitic language, in the same family as Hebrew and Aramaic. Around 260 million people use it as their first language. Many more people can also understand it, but not as a first language. It is written with the Arabic alphabet, which is written from right to left, like Hebrew. Since it is so widely spoken throughout the world, it is one of the six official languages of the UN, alongside English, Spanish, French, Russian, and Chinese.</p>\n\n<p>Many countries speak Arabic as an official language, but not all of them speak it the same way. There are many dialects, or varieties of a language, like Modern Standard Arabic, Egyptian Arabic, Gulf Arabic, Maghrebi Arabic, Levantine Arabic, and many others. Some of these dialects are so different from each other that speakers have a hard time understanding the other.</p>\n\n<p>Most of the countries that use Arabic as their official language are in the Middle East. They are part of the Arab World. This is because the largest religion in the Middle East is Islam.</p>\n\n<p>The language is very important in Islam, because Muslims believe that Allah (God) used it to talk to Muhammad through the Archangel Gabriel (Jibril), giving him the Quran in Arabic. Many Arabic speakers are Muslims, but not all are.</p>\n", `name`:"اللغة العربية\\n(Al-Lugatul Arabiyah)\\nThe Arabic Language", `uuid`:"19257b55-210b-46ea-aea3-87f24d2faf60", `UNIQUE IMPORT ID`:52});
CREATE (:`Node`:`UNIQUE IMPORT LABEL` {`active`:"true", `content`:"<p>.</p>\n", `name`:"الصرف\\n(Sarf)\\nMorphology", `uuid`:"01da9d1e-0f79-4c22-b4a1-1c586d9631dd", `UNIQUE IMPORT ID`:53});
CREATE (:`Node`:`UNIQUE IMPORT LABEL` {`active`:"true", `content`:"<p>.</p>\n", `name`:"النحو\\n(Nahu)\\nGrammar", `uuid`:"161623d6-72b6-4b3c-93b3-440a9f6b5275", `UNIQUE IMPORT ID`:54});
:commit
:begin
CREATE CONSTRAINT ON (node:`UNIQUE IMPORT LABEL`) ASSERT (node.`UNIQUE IMPORT ID`) IS UNIQUE;
:commit
:begin
MATCH (n1:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`:52}), (n2:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`:53}) CREATE (n1)-[r:`Connects` {`name`:"Branches", `uuid`:"71ad188b-3e1c-40e4-8aa1-123bd7f3266a"}]->(n2);
MATCH (n1:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`:52}), (n2:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`:54}) CREATE (n1)-[r:`Connects` {`name`:"Branches", `uuid`:"a7d3c682-b82a-47d5-a0b8-d28a7c1967b1"}]->(n2);
MATCH (n1:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`:54}), (n2:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`:0}) CREATE (n1)-[r:`Connects` {`name`:"Concerns", `uuid`:"ca579ec1-42ec-4871-9602-69b1c0206731"}]->(n2);
MATCH (n1:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`:54}), (n2:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`:1}) CREATE (n1)-[r:`Connects` {`name`:"Concerns", `uuid`:"88cef895-6e00-49c0-8420-61ea7de04ddf"}]->(n2);
MATCH (n1:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`:54}), (n2:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`:3}) CREATE (n1)-[r:`Connects` {`name`:"Concerns", `uuid`:"c893f792-a17d-49c4-9e7a-4c7d011e0cae"}]->(n2);
MATCH (n1:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`:0}), (n2:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`:20}) CREATE (n1)-[r:`Connects` {`name`:"Type", `uuid`:"0760ff5f-8204-418f-b720-48b083205221"}]->(n2);
MATCH (n1:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`:0}), (n2:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`:44}) CREATE (n1)-[r:`Connects` {`name`:"Type", `uuid`:"368973fd-4a2f-43c7-889b-919215245ccb"}]->(n2);
MATCH (n1:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`:0}), (n2:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`:45}) CREATE (n1)-[r:`Connects` {`name`:"Type", `uuid`:"2e928035-9ebe-4105-b47b-b9e5342bc30c"}]->(n2);
:commit
:begin
MATCH (n:`UNIQUE IMPORT LABEL`)  WITH n LIMIT 20000 REMOVE n:`UNIQUE IMPORT LABEL` REMOVE n.`UNIQUE IMPORT ID`;
:commit
:begin
DROP CONSTRAINT ON (node:`UNIQUE IMPORT LABEL`) ASSERT (node.`UNIQUE IMPORT ID`) IS UNIQUE;
:commit
