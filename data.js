/* =========================================================
   EDIT THIS: Add your own images in /images and list them here.
   If an image fails to load, a placeholder will appear instead.
========================================================= */
const LAB_IMAGES = {
  1: ["images/lab1_01.jpg","images/lab1_02.jpg"],
  2: ["images/lab2_01.jpg","images/lab2_02.jpg"],
  3: ["images/lab3_01.jpg","images/lab3_02.jpg"],
  4: ["images/lab4_01.jpg","images/lab4_02.jpg"],
  5: ["images/lab5_01.jpg","images/lab5_02.jpg"],
  6: ["images/lab6_01.jpg","images/lab6_02.jpg"],
  7: ["images/lab7_01.jpg","images/lab7_02.jpg"],
  8: ["images/lab8_01.jpg","images/lab8_02.jpg"],
  9: ["images/lab9_01.jpg","images/lab9_02.jpg"],
 10: ["images/lab10_01.jpg","images/lab10_02.jpg"],
 11: ["images/lab11_01.jpg","images/lab11_02.jpg"]
};

const LABS_LAB = [
  {id:1,  name:"Lab 1",  topic:"Back and Pectoral Girdle"},
  {id:2,  name:"Lab 2",  topic:"Axio-Appendicular and Scapulohumeral Muscles"},
  {id:3,  name:"Lab 3",  topic:"Axilla, Brachial Plexus, and Heart"},
  {id:4,  name:"Lab 4",  topic:"Arm, Cubital Fossa, and Elbow Joint"},
  {id:5,  name:"Lab 5",  topic:"Anterior and Posterior Forearm"},
  {id:6,  name:"Lab 6",  topic:"Wrist and Hand"},
  {id:7,  name:"Lab 7",  topic:"Abdominal Walls, Pelvis, and Hip Joint"},
  {id:8,  name:"Lab 8",  topic:"Gluteal Region and Thigh"},
  {id:9,  name:"Lab 9",  topic:"Knee Joint, Ankle Joints, and Bones of the Foot"},
  {id:10, name:"Lab 10", topic:"Muscles of the Leg and Foot"},
  {id:11, name:"Lab 11", topic:"Introduction to Neuroanatomy"}
];

/* =========================================================
   KIN 100 LECTURE — broad topic groups for student selection
   Each topic maps to one or more lecture IDs via LECTURE_TOPIC_MAP.
   Lecture 7 (Axilla & Brachial Plexus) appears in both
   Upper Limb and CNS so its questions show up in either topic.
========================================================= */
const LABS_LECTURE = [
  {id:1, name:"General Anatomy",      topic:"Intro, terminology & skeletal system"},
  {id:2, name:"Spine & Back",         topic:"Vertebrae, intervertebral discs & back muscles"},
  {id:3, name:"Upper Limb",           topic:"Shoulder to hand: bones, muscles, nerves & vessels"},
  {id:4, name:"Trunk",                topic:"Abdominal walls & diaphragm"},
  {id:5, name:"Lower Limb",           topic:"Pelvis to foot: bones, muscles, nerves & vessels"},
  {id:6, name:"CNS & Cranial Nerves", topic:"Brain, spinal cord & cranial nerves"}
];

/* Maps topic id → lecture ids whose questions belong to that topic */
const LECTURE_TOPIC_MAP = {
  1: [1, 2],
  2: [3],
  3: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
  4: [15],
  5: [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27],
  6: [7, 28, 29]
};
