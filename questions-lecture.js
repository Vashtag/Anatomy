/* =========================================================
   KIN 100 LECTURE — question bank
   Two formats (tab-separated):
   MC:   prompt<TAB>A<TAB>B<TAB>C<TAB>D<TAB>CorrectLetter<TAB>Explanation
   Fill: prompt<TAB>FILL<TAB>correct_answer
========================================================= */
const QUESTION_DATA_LECTURE = {
1: `
Which subdivision of anatomy studies structures visible to the naked eye?	Histology	Gross anatomy	Embryology	Neuroanatomy	B	Gross anatomy examines macroscopic structures without a microscope.
In the anatomical position, the palms face:	Backward	Forward	Medially	Laterally	B	Standard anatomical position defines palms facing anteriorly (forward).
Which plane divides the body into equal left and right halves?	Sagittal	Midsagittal	Coronal	Transverse	B	The midsagittal plane specifically bisects the body into equal halves.
The term 'superior' means:	Away from the head	Toward the head	Toward the front	Toward the back	B	Superior describes structures closer to the head end of the body.
Which directional term is synonymous with 'anterior'?	Dorsal	Ventral	Caudal	Medial	B	Ventral and anterior both refer to the front surface of the body.
The forearm region is located between the:	Shoulder and elbow	Elbow and wrist	Wrist and hand	Hip and knee	B	The forearm (antebrachium) spans from elbow to wrist.
Hyperextension refers to:	Normal extension	Additional extension beyond normal	Flexion movement	Lateral movement	B	Hyperextension is movement beyond the normal range of extension.
Which approach studies the body system by system?	Regional anatomy	Systemic anatomy	Surface anatomy	Clinical anatomy	B	Systemic anatomy organizes the body by organ systems rather than regions.
`.trim(),

2: `
Which bones are part of the axial skeleton?	Humerus and femur	Skull and vertebral column	Scapula and clavicle	Radius and ulna	B	The axial skeleton includes the skull, vertebral column, and ribcage.
Long bones are described as:	Cube shaped	Tubular	Flat	Irregular	B	Long bones have a tubular shaft (diaphysis) with expanded ends (epiphyses).
A tubercle is:	A large roughened eminence	A small rounded eminence	A sharp process	An opening	B	A tubercle is a small rounded bony projection for muscle attachment.
Which type of joint allows little to no movement?	Synovial	Fibrous	Condyloid	Ball and socket	B	Fibrous joints are united by fibrous tissue, permitting minimal movement.
The pubic symphysis is an example of a:	Fibrous joint	Primary cartilaginous joint	Secondary cartilaginous joint	Synovial joint	C	The pubic symphysis has a fibrocartilaginous disc, defining it as secondary cartilaginous.
Which joint type permits movement in several axes?	Hinge	Pivot	Ball and socket	Plane	C	Ball and socket joints allow multiaxial motion including rotation.
A foramen is:	A ridge of bone	A rounded opening	A flat surface	A sharp process	B	A foramen is a hole or opening in bone through which structures pass.
How many carpal bones are in the wrist?	5	7	8	14	C	Eight carpal bones form two rows in the wrist.
`.trim(),

3: `
How many cervical vertebrae are there?	5	7	12	33	B	There are 7 cervical vertebrae (C1–C7) in the neck.
Which vertebrae have bifid spinous processes?	Cervical	Thoracic	Lumbar	Sacral	A	Cervical vertebrae C2–C6 have split (bifid) spinous processes.
Thoracic vertebrae have articular facets for:	The skull	Ribs	The pelvis	The clavicle	B	Costal facets on thoracic vertebrae articulate with the ribs.
The atlanto-occipital joint permits:	Rotation	Flexion and extension	Lateral flexion	Circumduction	B	This joint allows nodding (yes motion), i.e., flexion and extension.
Which joint allows you to shake your head 'no'?	Atlanto-occipital	Atlanto-axial	Zygapophyseal	Intervertebral	B	The atlanto-axial joint (C1–C2) is a pivot joint allowing rotation.
Intervertebral discs are composed of an outer _______ and inner _______.	Nucleus pulposus; annulus fibrosus	Annulus fibrosus; nucleus pulposus	Synovial membrane; cartilage	Ligament; tendon	B	The outer fibrous ring is the annulus fibrosus; the gel-like center is the nucleus pulposus.
An exaggerated thoracic curvature is called:	Lordosis	Scoliosis	Kyphosis	Rotation	C	Kyphosis is excessive posterior (thoracic) curvature, a hunchback deformity.
The erector spinae group includes all EXCEPT:	Iliocostalis	Longissimus	Spinalis	Trapezius	D	Trapezius is a superficial back muscle, not part of erector spinae.
`.trim(),

4: `
The pectoral girdle consists of:	Humerus and radius	Scapula and clavicle	Sternum and ribs	Femur and tibia	B	The pectoral girdle connects the upper limb to the axial skeleton via scapula and clavicle.
The sternoclavicular joint is structurally classified as:	Hinge	Saddle	Ball and socket	Plane	B	The SC joint has a saddle-shaped articular surface allowing multiaxial movement.
Which ligament is an extrinsic ligament of the SC joint?	Anterior sternoclavicular	Posterior sternoclavicular	Costoclavicular	Glenohumeral	C	The costoclavicular ligament lies outside the joint capsule, making it extrinsic.
The acromioclavicular joint is classified as a:	Saddle joint	Plane joint	Hinge joint	Pivot joint	B	The AC joint has flat articular surfaces, classifying it as a plane synovial joint.
The glenohumeral joint is a:	Hinge joint	Pivot joint	Ball and socket joint	Condyloid joint	C	The spherical humeral head fits into the glenoid fossa, forming a ball and socket joint.
The glenoid labrum serves to:	Increase joint stability by deepening the cavity	Produce synovial fluid	Connect bones together	Reduce friction	A	The fibrocartilaginous labrum deepens the glenoid, improving shoulder stability.
Which is an intrinsic ligament of the glenohumeral joint?	Coracoacromial	Coracoclavicular	Coracohumeral	Costoclavicular	C	The coracohumeral ligament is a thickening of the glenohumeral joint capsule itself.
Intrinsic ligaments are:	Located away from the joint	Thickenings of the joint capsule	Always extrinsic	Made of muscle tissue	B	Intrinsic ligaments are formed by local thickenings within the fibrous joint capsule.
`.trim(),

5: `
Which muscle is innervated by the accessory nerve (CN XI)?	Latissimus dorsi	Pectoralis major	Trapezius	Serratus anterior	C	The trapezius is the only shoulder muscle innervated by cranial nerve XI.
The serratus anterior is innervated by the:	Long thoracic nerve	Dorsal scapular nerve	Thoracodorsal nerve	Medial pectoral nerve	A	The long thoracic nerve (C5–C7) specifically innervates serratus anterior.
Which muscle attaches to the floor of the bicipital groove?	Pectoralis major	Pectoralis minor	Latissimus dorsi	Trapezius	C	Latissimus dorsi inserts into the floor of the intertubercular (bicipital) groove.
The action of the upper fibers of trapezius is to:	Depress the scapula	Elevate the scapula	Protract the scapula	Rotate glenoid cavity downward	B	The upper trapezius elevates the scapula and shoulder, as in shrugging.
Which muscle protracts the scapula?	Rhomboid major	Trapezius	Serratus anterior	Levator scapula	C	Serratus anterior pulls the scapula forward (protraction) around the thorax.
The rhomboid muscles are innervated by:	Long thoracic nerve	Thoracodorsal nerve	Dorsal scapular nerve	Accessory nerve	C	The dorsal scapular nerve (C4–C5) innervates both rhomboid major and minor.
Which muscle attaches to the lateral lip of the bicipital groove?	Latissimus dorsi	Pectoralis major	Deltoid	Teres major	B	Pectoralis major inserts onto the lateral lip of the intertubercular groove.
Pectoralis minor attaches distally to the:	Bicipital groove	Coracoid process	Acromion	Spine of scapula	B	Pectoralis minor inserts onto the medial border and tip of the coracoid process.
`.trim(),

6: `
Which muscles make up the rotator cuff?	Deltoid, teres major, biceps, triceps	Supraspinatus, infraspinatus, teres minor, subscapularis	Pectoralis major, latissimus dorsi, trapezius, serratus anterior	Biceps, brachialis, coracobrachialis, triceps	B	The SITS muscles (Supraspinatus, Infraspinatus, Teres minor, Subscapularis) form the rotator cuff.
The deltoid is innervated by the:	Radial nerve	Axillary nerve	Musculocutaneous nerve	Suprascapular nerve	B	The axillary nerve (C5–C6) innervates both deltoid and teres minor.
Which muscle is responsible for the first 15 degrees of shoulder abduction?	Deltoid	Supraspinatus	Infraspinatus	Teres minor	B	Supraspinatus initiates abduction before deltoid takes over beyond 15 degrees.
Subscapularis causes:	External rotation	Internal rotation	Abduction	Extension	B	Subscapularis originates on the subscapular fossa and medially rotates the humerus.
The middle fibers of deltoid cause:	Shoulder flexion	Shoulder extension	Shoulder abduction	Shoulder adduction	C	The middle deltoid lies lateral to the shoulder, pulling the arm away from the body.
Teres major attaches to the:	Greater tubercle	Lesser tubercle	Medial lip of bicipital groove	Deltoid tuberosity	C	Teres major inserts onto the medial lip of the intertubercular groove alongside latissimus dorsi.
Which two rotator cuff muscles cause external rotation?	Supraspinatus and subscapularis	Infraspinatus and teres minor	Teres minor and subscapularis	Supraspinatus and infraspinatus	B	Infraspinatus and teres minor both externally rotate the humerus at the shoulder.
Teres major is innervated by:	Axillary nerve	Suprascapular nerve	Lower subscapular nerve	Upper subscapular nerve	C	The lower subscapular nerve (C5–C6) innervates teres major and subscapularis.
`.trim(),

7: `
The axilla is shaped like a:	Cube	Cylinder	Pyramid	Sphere	C	The axilla has an apex, base, and four walls, forming a pyramid shape.
The anterior wall of the axilla is formed by:	Scapula and subscapularis	Pectoralis major, minor, and subclavius	Ribs and serratus anterior	Latissimus dorsi and teres major	B	The anterior wall is composed of the pectoral muscles and subclavius.
The brachial plexus is formed by anterior rami of:	C1-C5	C5-T1	T1-T5	C6-T2	B	The brachial plexus arises from C5 through T1 to supply the upper limb.
Which nerve supplies serratus anterior?	Dorsal scapular	Long thoracic	Thoracodorsal	Suprascapular	B	The long thoracic nerve runs along the thorax to innervate serratus anterior.
The axillary artery is a continuation of the:	Brachial artery	Subclavian artery	Carotid artery	Radial artery	B	The subclavian artery becomes the axillary artery at the lateral border of the first rib.
Blood returns to the heart from the upper limb via the:	Brachial vein → axillary vein → subclavian vein	Radial vein → brachial vein → carotid vein	Cephalic vein → subclavian vein → superior vena cava	Basilic vein → brachial vein → inferior vena cava	A	Deep veins accompany the arteries: brachial → axillary → subclavian → heart.
The lateral wall of the axilla is formed by:	Ribs	Scapula	Bicipital groove	Clavicle	C	The intertubercular (bicipital) groove of the humerus forms the narrow lateral wall.
Which nerve supplies the rhomboid muscles?	Long thoracic	Dorsal scapular	Suprascapular	Thoracodorsal	B	The dorsal scapular nerve (C4–C5) innervates rhomboid major and minor.
`.trim(),

8: `
The ulna is _______ to the radius.	Lateral	Medial	Superior	Inferior	B	In anatomical position, the ulna lies on the medial (little finger) side of the forearm.
Biceps brachii is innervated by the:	Radial nerve	Median nerve	Musculocutaneous nerve	Ulnar nerve	C	The musculocutaneous nerve (C5–C6) innervates all three anterior arm muscles.
Which muscle is the primary elbow flexor?	Biceps brachii	Brachialis	Coracobrachialis	Triceps brachii	B	Brachialis acts solely as elbow flexor regardless of forearm pronation or supination.
The long head of biceps brachii attaches to the:	Infraglenoid tubercle	Supraglenoid tubercle	Coracoid process	Deltoid tuberosity	B	The long head originates from the supraglenoid tubercle of the scapula.
Triceps brachii is innervated by the:	Musculocutaneous nerve	Median nerve	Radial nerve	Axillary nerve	C	The radial nerve innervates all muscles of the posterior arm, including triceps.
The cephalic vein drains into the:	Brachial vein	Basilic vein	Axillary vein	Subclavian vein	C	The cephalic vein travels laterally and empties into the axillary vein.
Which nerve has no branches in the arm?	Radial	Musculocutaneous	Median	Axillary	C	The median nerve passes through the arm without giving off any muscular branches.
The profunda brachii artery travels with the:	Median nerve	Ulnar nerve	Radial nerve	Musculocutaneous nerve	C	The profunda brachii accompanies the radial nerve in the radial groove of the humerus.
`.trim(),

9: `
The cubital fossa is bounded medially by:	Brachioradialis	Pronator teres	Biceps brachii	Brachialis	B	Pronator teres forms the medial border of the cubital fossa.
The elbow joint is classified as a:	Ball and socket	Hinge	Pivot	Saddle	B	The trochlea and capitulum create a hinge allowing only flexion and extension.
The anular ligament encircles the:	Head of the ulna	Head of the radius	Capitulum	Trochlea	B	The anular ligament wraps around the radial head, securing it to the ulna.
The proximal radioulnar joint allows:	Flexion and extension	Abduction and adduction	Pronation and supination	Circumduction	C	The pivot-type proximal radioulnar joint enables forearm rotation (pronation/supination).
Tommy John surgery reconstructs the:	Radial collateral ligament	Ulnar collateral ligament	Anular ligament	Interosseous membrane	B	The ulnar collateral ligament stabilizes the medial elbow; its rupture requires reconstruction.
The capitulum of the humerus articulates with:	Trochlear notch of ulna	Head of radius	Olecranon	Coronoid process	B	The capitulum is a rounded lateral condyle that articulates with the radial head.
A common cause of radial head dislocation in children is:	Falling on outstretched hand	Being lifted by the arm	Throwing a ball	Hitting the elbow	B	Sudden axial traction (nursemaid's elbow) pulls the radial head out of the anular ligament.
During pronation and supination, the radius moves around the:	Humerus	Fixed ulna	Carpals	Scapula	B	The ulna is stabilized while the radius rotates around it during forearm rotation.
`.trim(),

10: `
How many carpal bones are there?	5	7	8	14	C	Eight carpal bones are arranged in two rows of four in the wrist.
Which carpal bone has a hook?	Hamate	Scaphoid	Trapezium	Capitate	A	The hamate has a hook-shaped process (hamulus) on its palmar surface.
The radiocarpal joint is classified as:	Hinge	Pivot	Condyloid	Ball and socket	C	The oval proximal carpal row fits the elliptical radius, forming a condyloid joint.
Which bone does NOT contribute to the radiocarpal joint?	Radius	Scaphoid	Lunate	Ulna	D	The ulna is separated from the carpals by the articular disc and does not articulate directly.
The thumb has how many phalanges?	1	2	3	4	B	The thumb (digit I) has only a proximal and distal phalanx, totaling two.
Metacarpophalangeal joints allow:	Only flexion and extension	Only rotation	Flexion, extension, abduction, and adduction	Only circumduction	C	The condyloid MCP joints permit movement in two axes, enabling four directions of motion.
Interphalangeal joints are classified as:	Condyloid	Hinge	Pivot	Saddle	B	IP joints have a pulley-shaped surface allowing only flexion and extension (hinge).
The carpometacarpal joint of the thumb is:	A plane joint	A saddle joint	A hinge joint	A pivot joint	B	The saddle-shaped CMC joint of the thumb allows the wide range of thumb opposition.
`.trim(),

11: `
The forearm is divided into two muscle compartments by which structure?	Flexor retinaculum	Interosseous membrane	Palmar aponeurosis	Fascia lata	B	The interosseous membrane runs between radius and ulna, separating anterior and posterior compartments.
Which muscle is found in the MIDDLE layer of the anterior forearm?	Pronator teres	Flexor carpi ulnaris	Flexor digitorum superficialis	Pronator quadratus	C	FDS forms its own middle layer, sandwiched between the superficial and deep muscle groups.
Pronator Teres is innervated by which nerve?	Ulnar nerve	Radial nerve	Median nerve	Musculocutaneous nerve	C	The median nerve supplies all anterior forearm muscles except FCU and medial half of FDP.
Flexor Carpi Radialis inserts onto the base of which metacarpal?	1st	2nd	4th	5th	B	FCR crosses to the radial side and inserts at the 2nd metacarpal base to flex and abduct the wrist.
The 'common flexor origin' refers to the __________ epicondyle of the humerus.	FILL	medial	Most anterior forearm flexors originate from the medial epicondyle via a shared tendon.
Palmaris Longus is absent on one or both sides in approximately __________% of the population.	FILL	15	Palmaris longus is a vestigial muscle, absent in about 15% of people with no functional loss.
Flexor Digitorum Profundus inserts onto the __________ phalanges of digits II–V.	FILL	distal	FDP tendons pass through FDS splits to reach the distal phalanges for terminal finger flexion.
The carpal tunnel is created deep to the __________ retinaculum.	FILL	flexor	The flexor retinaculum forms the roof of the carpal tunnel, enclosing the median nerve and tendons.
`.trim(),

12: `
The 'common extensor origin' is located on which bony landmark?	Medial epicondyle of humerus	Lateral epicondyle of humerus	Olecranon process	Lateral supraepicondylar ridge	B	All superficial posterior forearm extensors share the lateral epicondyle as their common origin.
Brachioradialis is innervated by which nerve?	Median nerve	Ulnar nerve	Radial nerve	Anterior interosseous nerve	C	Brachioradialis lies in the posterior compartment and is innervated by the radial nerve.
Which muscle inserts onto the base of the 5th metacarpal?	Extensor Carpi Radialis Longus	Extensor Carpi Radialis Brevis	Extensor Carpi Ulnaris	Extensor Digitorum	C	ECU runs along the ulnar side and inserts at the 5th metacarpal base to extend and adduct the wrist.
The floor of the anatomical snuff box is formed by the scaphoid and which other bone?	Lunate	Trapezoid	Trapezium	Capitate	C	The snuff box floor is formed by scaphoid proximally and trapezium distally.
Extensor Pollicis Longus inserts onto the __________ phalanx of the thumb.	FILL	distal	EPL forms the ulnar border of the snuff box and extends the thumb's distal phalanx.
The tendon of Extensor Digitorum splits into a median band and two __________ bands at the extensor expansion.	FILL	lateral	The extensor expansion has a central median slip and two lateral bands that extend the IP joints.
The radial artery passes through the anatomical snuff box and becomes the __________ palmar arch in the hand.	FILL	deep	The radial artery dives between the first dorsal interosseous to form the deep palmar arch.
Abductor Pollicis Longus inserts onto the base of the __________ metacarpal.	FILL	1st	APL abducts the thumb by inserting onto the lateral base of the first metacarpal.
`.trim(),

13: `
The brachial artery bifurcates just distal to which structure?	Axilla	Carpal tunnel	Cubital fossa	Anatomical snuff box	C	The brachial artery divides into radial and ulnar arteries just below the cubital fossa.
The ulnar nerve passes __________ to the flexor retinaculum (does NOT pass through the carpal tunnel).	Deep	Superficial	Anterior	Posterior	B	The ulnar nerve travels through Guyon's canal superficial to the flexor retinaculum, avoiding the carpal tunnel.
Carpal tunnel syndrome most commonly causes paresthesia in the skin of which digits?	Medial 1½ digits	Lateral 3½ digits	All 5 digits	Digits IV and V only	B	The median nerve supplies the lateral 3½ digits; compression in carpal tunnel causes tingling there.
The deep branch of the radial nerve pierces which muscle as it enters the posterior forearm?	Brachioradialis	Extensor carpi ulnaris	Supinator	Pronator teres	C	The posterior interosseous nerve (deep radial) passes through the supinator to enter the posterior forearm.
The ulnar artery continues in the hand as the __________ palmar arch.	FILL	superficial	The ulnar artery is the main supply to the superficial palmar arch in the hand.
The median nerve courses through the forearm between flexor digitorum superficialis and __________.	FILL	flexor digitorum profundus	The median nerve runs in the plane between FDS and FDP through the forearm.
In the forearm, the ulnar nerve supplies flexor carpi ulnaris and the __________ half of flexor digitorum profundus.	FILL	medial	The ulnar nerve innervates FCU and the medial (ulnar) half of FDP for digits IV and V.
Carpal tunnel syndrome can be surgically treated by cutting the __________ retinaculum.	FILL	flexor	Dividing the flexor retinaculum decompresses the carpal tunnel, relieving median nerve pressure.
`.trim(),

14: `
The thenar muscles are innervated by which nerve?	Deep branch of ulnar nerve	Superficial branch of ulnar nerve	Recurrent branch of median nerve	Anterior interosseous nerve	C	The recurrent (thenar) branch of the median nerve hooks back to supply the thenar eminence muscles.
Lumbricals originate from the tendons of which muscle?	Flexor Digitorum Superficialis	Flexor Digitorum Profundus	Flexor Pollicis Longus	Extensor Digitorum	B	Lumbricals arise from FDP tendons, allowing them to flex MCPs and extend IP joints simultaneously.
The 3rd and 4th lumbricals are innervated by which nerve?	Median nerve	Superficial branch of ulnar nerve	Deep branch of ulnar nerve	Radial nerve	C	The ulnar nerve (deep branch) innervates the lateral two lumbricals (3rd and 4th).
Palmar interossei perform adduction of digits II, IV, and V. Which digit CANNOT adduct?	Index (II)	Middle (III)	Ring (IV)	Little (V)	B	Digit III is the reference axis; adduction moves toward it, so digit III itself cannot adduct.
The palmar aponeurosis is continuous proximally with the flexor retinaculum and the tendon of __________.	FILL	palmaris longus	Palmaris longus blends into the palmar aponeurosis at the wrist, tensioning the fascial sheet.
There are __________ dorsal interossei in the hand.	FILL	4	Four dorsal interossei fill the four spaces between the five metacarpals and abduct the fingers.
Adductor pollicis, the only muscle in the adductor compartment, is innervated by the __________ branch of the ulnar nerve.	FILL	deep	The deep branch of the ulnar nerve innervates all hypothenar, interossei, and adductor pollicis.
Lumbricals insert into the __________ expansions of digits II–V.	FILL	extensor	Lumbricals attach to the extensor expansions on the dorsum, enabling IP extension while flexing MCPs.
`.trim(),

15: `
The fibre direction of External Oblique is best described as:	Horizontal	Anterosuperior	Anteroinferior ('hands in pockets')	Vertical	C	External oblique fibres run like hands sliding into front pockets, i.e., anteroinferiorly.
Which opening in the diaphragm is at the level of T8?	Aortic hiatus	Esophageal hiatus	Caval opening	Lumbar hiatus	C	The caval opening at T8 transmits the inferior vena cava through the central tendon.
The aponeuroses of the anterolateral abdominal muscles meet at the midline to form the:	Rectus sheath only	Inguinal ligament	Linea alba	Tendinous intersection	C	The three flat muscle aponeuroses interdigitate at the midline creating the avascular linea alba.
Which posterior abdominal wall muscle inserts onto the iliac crest?	Psoas major	Iliacus	Quadratus lumborum	Rectus abdominis	C	Quadratus lumborum spans from the 12th rib and lumbar vertebrae down to the iliac crest.
The inferior edge of the aponeurosis of external oblique forms the __________ ligament.	FILL	inguinal	The free inferior border of external oblique aponeurosis folds back on itself to form the inguinal ligament.
The diaphragm's muscle fibres converge to form the __________ tendon, which supports the weight of the heart.	FILL	central	Diaphragm muscle fibres insert into the central tendon, which bears the weight of the pericardium.
The aortic hiatus in the diaphragm is at vertebral level __________.	FILL	T12	The aortic hiatus at T12 transmits the aorta and thoracic duct posterior to the diaphragm.
The lumbar plexus is formed within the __________ major muscle.	FILL	psoas	The lumbar plexus (L1–L4) forms within the substance of the psoas major muscle.
`.trim(),

16: `
Each hip bone is formed by the fusion of which three bones?	Ilium, fibula, pubis	Ilium, ischium, pubis	Sacrum, ilium, ischium	Femur, ilium, pubis	B	The os coxae forms when ilium, ischium, and pubis fuse at the acetabulum during puberty.
Compared to the male pelvis, the female pelvic inlet is:	Heart-shaped and narrow	Oval/rounded and wide	Triangular	Identical in shape	B	The female pelvis is wider and more oval to accommodate childbirth, unlike the narrow male inlet.
The sacroiliac joint is classified as compound: anteriorly it is __________ and posteriorly it is a syndesmosis.	Fibrocartilaginous	Gomphosis	Synovial	Cartilaginous	C	The anterior SI joint has a synovial cavity, while the posterior part is held by strong interosseous ligaments.
Which two ligaments resist the anterior rotation tendency of the pelvis in standing?	Inguinal and iliofemoral	Sacrotuberous and sacrospinous	Pubofemoral and ischiofemoral	Pubic and iliolumbar	B	Sacrotuberous and sacrospinous ligaments prevent anterior tilting of the sacrum under body weight.
The acetabulum is formed by contributions from all three hip bones: ilium, ischium, and __________.	FILL	pubis	All three bones meet at the Y-shaped triradiate cartilage to form the acetabulum.
The sacrum is formed by __________ fused vertebrae.	FILL	5	Five sacral vertebrae (S1–S5) fuse during development to form the triangular sacrum.
The lumbosacral trunk (L4 and L5) unites with S1, S2, and S3 to form the __________ nerve.	FILL	sciatic	L4–S3 contributions converge to form the sciatic nerve, the largest nerve in the body.
In anatomical standing position, the ASIS and the __________ lie in the same vertical plane.	FILL	pubic symphysis	In neutral pelvic alignment, ASIS and pubic symphysis are co-planar in a vertical plane.
`.trim(),

17: `
The hip joint is classified as which type of synovial joint?	Hinge	Condyloid	Pivot	Ball and socket	D	The spherical femoral head fits into the deep acetabulum, forming a multiaxial ball and socket joint.
All three intrinsic ligaments of the hip joint tighten during which movement?	Hip flexion	Hip extension	Hip abduction	Hip medial rotation	B	Extension winds all three capsular ligaments tight, providing passive stability in upright standing.
The thickened lateral band of fascia lata is known as the:	Crural fascia	Iliotibial band	Patellar ligament	Plantar fascia	B	The IT band is a dense lateral thickening of fascia lata from iliac crest to Gerdy's tubercle.
The great saphenous vein drains into which vessel?	Popliteal vein	External iliac vein	Femoral vein	Posterior tibial vein	C	The great saphenous vein ascends medially and drains into the femoral vein at the saphenous opening.
The deep fascia of the thigh is called __________ lata.	FILL	fascia	Fascia lata is the thick deep fascia enveloping the thigh muscles like a stocking.
The IT band attaches distally to Gerdy's tubercle on the __________ tibial condyle.	FILL	lateral	Gerdy's tubercle is a bony prominence on the anterolateral aspect of the lateral tibial condyle.
The ligament of the head of the femur attaches to a depression on the femoral head called the __________.	FILL	fovea	The fovea capitis is a small pit on the femoral head where the ligamentum teres attaches.
Varicose veins occur when the saphenous veins dilate so that the __________ no longer close properly.	FILL	valves	Venous valves prevent backflow; dilation separates their cusps causing incompetence and varices.
`.trim(),

18: `
Which is the longest muscle in the body?	Gracilis	Rectus femoris	Adductor magnus	Sartorius	D	Sartorius runs diagonally from ASIS to medial tibia, making it the longest muscle in the body.
The entire quadriceps femoris group is innervated by which nerve?	Obturator nerve	Sciatic nerve	Femoral nerve	Superior gluteal nerve	C	The femoral nerve (L2–L4) innervates all four quadriceps muscles in the anterior compartment.
The hamstring part of adductor magnus is innervated by which nerve?	Obturator nerve	Femoral nerve	Tibial branch of sciatic nerve	Superior gluteal nerve	C	The hamstring (ischiocondylar) part is innervated by the tibial division of the sciatic nerve.
Obturator externus performs which action?	Hip adduction	Hip flexion	Hip medial rotation	Hip lateral rotation	D	Obturator externus is a short lateral rotator that inserts into the trochanteric fossa.
Rectus femoris originates from the __________ (AIIS).	FILL	anterior inferior iliac spine	Rectus femoris is the only quadriceps muscle that crosses the hip, originating from the AIIS.
Sartorius originates from the ASIS and inserts onto the medial tibia at the __________.	FILL	pes anserinus	The pes anserinus is where sartorius, gracilis, and semitendinosus tendons converge on the tibia.
Gracilis is innervated by the __________ nerve.	FILL	obturator	Gracilis is a medial thigh adductor innervated by the obturator nerve (L2–L3).
The adductor part of adductor magnus inserts onto the linea aspera; the hamstring part inserts onto the __________ tubercle.	FILL	adductor	The adductor tubercle on the medial femoral condyle is the distal insertion of the hamstring part.
`.trim(),

19: `
Which structure forms the superior boundary of the femoral triangle?	Sartorius	Adductor longus	Inguinal ligament	Pectineus	C	The inguinal ligament forms the base (superior boundary) of the femoral triangle.
The contents of the femoral triangle from lateral to medial are:	Vein, artery, nerve, lymphatics	Nerve, artery, vein, lymphatics	Artery, vein, nerve, lymphatics	Lymphatics, vein, artery, nerve	B	NAVeL mnemonic: Nerve, Artery, Vein, then empty space and Lymphatics from lateral to medial.
The adductor canal is also known as the:	Femoral canal	Obturator canal	Subsartorial canal	Adductor hiatus	C	The adductor (subsartorial) canal runs deep to sartorius down the medial thigh.
At the adductor hiatus, the femoral artery passes posterior to become the:	Tibial artery	Popliteal artery	Fibular artery	Obturator artery	B	The femoral artery passes through the adductor hiatus to reach the popliteal fossa as the popliteal artery.
The medial border of the femoral triangle is formed by __________ longus.	FILL	adductor	Adductor longus forms the medial border of the femoral triangle.
The floor of the femoral triangle is formed by iliopsoas and __________.	FILL	pectineus	The femoral triangle floor is formed by iliopsoas laterally and pectineus medially.
The adductor canal runs from the apex of the femoral triangle to the __________ hiatus.	FILL	adductor	The adductor canal terminates at the adductor hiatus where the femoral artery exits posteriorly.
At the adductor hiatus, the popliteal vein passes anteriorly and becomes the __________ vein.	FILL	femoral	Venous blood ascends: popliteal vein passes through the hiatus to become the femoral vein.
`.trim(),

20: `
Gluteus maximus is innervated by which nerve?	Superior gluteal nerve	Inferior gluteal nerve	Nerve to piriformis	Sciatic nerve	B	The inferior gluteal nerve (L5–S2) specifically innervates gluteus maximus.
Which two muscles share the actions of hip abduction and medial rotation?	Gluteus maximus and piriformis	Gluteus medius and gluteus minimus	Tensor fascia lata and gluteus maximus	Obturator internus and quadratus femoris	B	Gluteus medius and minimus both abduct and medially rotate the hip, crucial for gait.
Piriformis inserts onto which structure?	Lesser trochanter	Ischial tuberosity	Greater trochanter	Trochanteric fossa	C	Piriformis exits the greater sciatic foramen and inserts onto the greater trochanter.
Which of the following does NOT perform lateral rotation of the hip?	Piriformis	Quadratus femoris	Gluteus medius	Obturator internus	C	Gluteus medius performs medial rotation and abduction, not lateral rotation.
Gluteus maximus inserts onto the gluteal tuberosity and onto Gerdy's tubercle via the __________ band.	FILL	iliotibial	Gluteus maximus partially inserts via the IT band to transmit force distally to the lateral tibia.
Superior gemellus originates from the ischial __________, while inferior gemellus originates from the ischial tuberosity.	FILL	spine	Superior gemellus arises from the ischial spine; inferior gemellus arises from the ischial tuberosity.
Obturator internus and the gemelli all insert onto the __________ fossa.	FILL	trochanteric	Obturator internus and both gemelli insert together into the trochanteric fossa as a triceps coxae.
The sciatic nerve typically exits the gluteal region __________ to piriformis.	FILL	inferior	In most people the sciatic nerve exits through the greater sciatic foramen below piriformis.
`.trim(),

21: `
Which of the following muscles attaches distally to the medial tibia (pes anserinus)?	Semimembranosus	Semitendinosus	Biceps femoris	Plantaris	B	Semitendinosus joins sartorius and gracilis at the pes anserinus on the medial tibia.
The short head of biceps femoris originates from the ___.	FILL	linea aspera	The short head originates from the linea aspera, unlike the long head from the ischial tuberosity.
Which nerve innervates the short head of biceps femoris?	Tibial part of sciatic nerve	Femoral nerve	Common fibular part of sciatic nerve	Obturator nerve	C	The short head is embryologically anterior, so it receives the common fibular (peroneal) branch.
The popliteal fossa is described as ___ in shape.	FILL	diamond-shaped	The four muscle borders create a diamond (rhombus) shape when the knee is slightly flexed.
Which structure forms the superolateral border of the popliteal fossa?	Semimembranosus	Lateral head of gastrocnemius	Biceps femoris	Semitendinosus	C	Biceps femoris tendon runs laterally and superiorly, forming the superolateral boundary.
The ___ nerve and the ___ nerve are both contents of the popliteal fossa.	FILL	tibial; common fibular	Both terminal branches of the sciatic nerve pass through the popliteal fossa before diverging.
Which of the following actions is performed by ALL three hamstring muscles?	Hip flexion	Knee extension	Hip extension and knee flexion	Foot plantarflexion	C	All three hamstrings cross both hip and knee, extending the hip and flexing the knee.
Semimembranosus inserts into the ___ aspect of the medial tibial condyle.	FILL	posterior	Semimembranosus inserts posteriorly, distinguishing it from semitendinosus which goes to pes anserinus.
`.trim(),

22: `
The knee joint is classified as which type of joint?	Ball and socket, synovial	Modified hinge, synovial	Plane, synovial	Pivot, fibrous	B	The knee allows mainly flexion/extension but also slight rotation, making it a modified hinge.
The fibula _____ involved in the knee joint.	FILL	is not	The fibula articulates at the proximal tibiofibular joint, not directly with the femur.
Which of the following is an EXTRINSIC ligament of the knee?	Patellar ligament	Oblique popliteal ligament	Anterior cruciate ligament	Arcuate popliteal ligament	C	The ACL lies within the joint capsule (intracapsular), making it intrinsic, not extrinsic.
The ACL attaches to the ___ aspect of the intercondylar eminence and passes to the ___ femoral condyle.	FILL	anterior; lateral	The ACL runs from the anterior tibial eminence up to the posterior lateral femoral condyle wall.
A valgus force to the knee refers to impact on which side?	Medial aspect	Posterior aspect	Lateral aspect	Anterior aspect	C	Valgus stress comes from the lateral side, pushing the knee medially and stressing the MCL.
The medial meniscus is ___ in shape, while the lateral meniscus is ___ in shape.	FILL	C-shaped; oval-shaped	The medial meniscus is open C-shaped; the lateral is a more closed oval or near-circle.
The posterior cruciate ligament prevents the tibia from moving in which direction?	Anteriorly under the femur	Posteriorly under the femur	Laterally under the femur	Rotating under the femur	B	The PCL is taut when the tibia slides posteriorly, preventing posterior tibial displacement.
The proximal tibiofibular joint is classified as a ___ synovial joint.	FILL	plane	Flat articular surfaces at the proximal tibiofibular joint allow only gliding movements.
`.trim(),

23: `
How many tarsal bones are in the foot?	5	6	7	8	C	The seven tarsals are: calcaneus, talus, navicular, cuboid, and three cuneiforms.
In the foot, digit numbering begins on the ___ side.	FILL	medial	Digit 1 (hallux/big toe) is on the medial side, mirroring thumb numbering in the hand.
Which tarsal bone transmits weight from the tibia to the calcaneus?	Navicular	Cuboid	Talus	Calcaneus	C	The talus sits atop the calcaneus and receives the entire body weight from the tibia.
The shelf of bone on the medial calcaneus that supports the talus is called the ___.	FILL	sustentaculum tali	The sustentaculum tali is a medial calcaneal shelf that cradles and supports the talar head.
The talocrural joint is classified as which type of joint?	Plane, synovial	Hinge, synovial	Condyloid, synovial	Syndesmosis	B	The mortise of tibia/fibula grips the talar trochlea, forming a hinge allowing dorsi/plantarflexion.
The medial collateral ligament of the talocrural joint is also called the ___ ligament.	FILL	deltoid	The deltoid ligament is the strong fan-shaped medial collateral ligament of the ankle.
Which ligament spans from the sustentaculum tali to the navicular and supports the head of the talus?	Long plantar ligament	Short plantar ligament	Plantar calcaneonavicular (spring) ligament	Calcaneofibular ligament	C	The spring ligament directly supports the talar head, maintaining the medial longitudinal arch.
The subtalar joint allows ___ and ___ of the foot.	FILL	inversion; eversion	The subtalar (talocalcaneal) joint is the primary joint for foot inversion and eversion.
`.trim(),

24: `
How many compartments are found in the leg?	2	3	4	5	B	The leg has anterior, lateral, superficial posterior, and deep posterior compartments — four total.
Tibialis anterior inserts into the medial cuneiform and ___.	FILL	base of 1st metatarsal	Tibialis anterior inserts at the medial cuneiform and 1st metatarsal to dorsiflex and invert the foot.
Which muscle of the anterior compartment is not always present?	Tibialis anterior	Extensor hallucis longus	Extensor digitorum longus	Fibularis tertius	D	Fibularis tertius is a variable slip of extensor digitorum longus, absent in some individuals.
All muscles of the anterior compartment are innervated by the ___ nerve.	FILL	deep fibular	The deep fibular (peroneal) nerve enters the anterior compartment and supplies all four muscles.
Extensor digitorum longus inserts into digits ___	1–4	2–5	1–5	3–5	B	EDL splits into four slips that insert onto the dorsal expansions of digits 2 through 5.
The anterior tibial artery continues onto the dorsum of the foot as the ___ artery.	FILL	dorsalis pedis	At the ankle the anterior tibial artery is renamed the dorsalis pedis, supplying the dorsal foot.
The common fibular nerve winds around the neck of the fibula and divides into which two branches?	Medial and lateral plantar nerves	Tibial and sural nerves	Superficial and deep fibular nerves	Saphenous and sural nerves	C	At the fibular neck the common fibular nerve divides into superficial (lateral compartment) and deep (anterior compartment) branches.
Retinacula at the ankle are thickenings of the ___ fascia that prevent tendons from bowstringing.	FILL	crural	The crural (deep leg) fascia thickens into retinacula straps that hold tendons close to the ankle.
`.trim(),

25: `
Which nerve supplies all muscles in the lateral compartment of the leg?	Deep fibular nerve	Tibial nerve	Superficial fibular nerve	Sural nerve	C	The superficial fibular nerve enters the lateral compartment and innervates fibularis longus and brevis.
Fibularis longus originates from the ___ of the fibula.	FILL	head	Fibularis longus arises from the head and upper lateral shaft of the fibula.
Which of the following is an action shared by BOTH fibularis longus and brevis?	Foot inversion and dorsiflexion	Foot eversion and ankle plantarflexion	Knee flexion and ankle dorsiflexion	Hip extension and foot eversion	B	Both fibularis muscles run posterior to the lateral malleolus, everting the foot and plantarflexing the ankle.
Fibularis brevis inserts into the base of the ___ metatarsal.	FILL	5th	Fibularis brevis inserts onto the styloid process at the base of the 5th metatarsal.
The fibular artery is a branch of which artery?	Anterior tibial artery	Dorsalis pedis artery	Posterior tibial artery	Popliteal artery	C	The fibular (peroneal) artery branches off the posterior tibial artery just below the knee.
The fibular artery supplies the fibularis muscles via ___ branches.	FILL	perforating	Perforating branches pierce the intermuscular septum to reach the lateral compartment muscles.
The tendons of fibularis longus and brevis pass behind which bony landmark at the ankle?	Medial malleolus	Calcaneal tuberosity	Lateral malleolus	Sustentaculum tali	C	Both fibularis tendons curve posteriorly around the lateral malleolus held by the superior retinaculum.
Fibularis longus shares the same distal attachment as tibialis anterior: the ___ and base of 1st metatarsal.	FILL	medial cuneiform	Fibularis longus crosses the plantar foot to insert with tibialis anterior, forming the "stirrup."
`.trim(),

26: `
Which muscle unlocks the extended knee by rotating the femur laterally?	Plantaris	Soleus	Popliteus	Flexor hallucis longus	C	Popliteus laterally rotates the femur on the fixed tibia to "unlock" the fully extended knee.
Gastrocnemius originates from both the medial and lateral ___ condyles.	FILL	femoral	Gastrocnemius arises from the posterior surfaces of both femoral condyles, crossing the knee.
Which superficial posterior leg muscle only performs ankle plantarflexion (NOT knee flexion)?	Gastrocnemius	Plantaris	Soleus	Tibialis posterior	C	Soleus originates below the knee so it only plantarflexes the ankle without acting on the knee.
Tibialis posterior performs ankle plantarflexion and foot ___.	FILL	inversion	Tibialis posterior is the deepest posterior muscle; it inverts the foot and supports the medial arch.
From anterior to posterior behind the medial malleolus, which structure comes FIRST?	Tendon of flexor digitorum longus	Posterior tibial artery	Tendon of tibialis posterior	Tibial nerve	C	The mnemonic Tom Dick And Harry: Tibialis posterior is the most anterior structure behind the malleolus.
Rupture of the calcaneal tendon usually occurs ___ cm proximal to the calcaneal attachment.	FILL	1–5	The watershed zone of poor vascularity 2–6 cm above the heel is the most common rupture site.
The posterior tibial artery divides into which two arteries in the foot?	Anterior tibial and fibular arteries	Dorsalis pedis and fibular arteries	Medial and lateral plantar arteries	Superficial and deep plantar arteries	C	Beneath the flexor retinaculum the posterior tibial artery splits into medial and lateral plantar arteries.
The soleus originates from the soleal line of the tibia and the ___ of the fibula.	FILL	head	The soleus arises from the soleal line of tibia and the posterior head and upper fibula.
`.trim(),

27: `
The plantar aponeurosis helps support the ___ arch of the foot.	FILL	longitudinal	The plantar aponeurosis runs heel to toes, acting as a tie-beam to maintain the longitudinal arch.
Which muscle in the 2nd layer of the foot realigns the pull of the flexor digitorum longus tendon?	Lumbricals	Quadratus plantae	Adductor hallucis	Flexor hallucis brevis	B	Quadratus plantae attaches to FDL and redirects its oblique pull to act straight toward the heel.
The lumbricals of the foot originate from the tendons of ___.	FILL	flexor digitorum longus	Foot lumbricals arise from FDL tendons, enabling them to flex MTP and extend IP joints.
Which of the following 1st layer muscles is innervated by the LATERAL plantar nerve?	Abductor hallucis	Flexor digitorum brevis	Abductor digiti minimi	Flexor hallucis brevis	C	Abductor digiti minimi on the lateral foot is innervated by the lateral plantar nerve.
In the foot, the reference digit for the midline is digit ___.	FILL	2	Digit 2 is the axial reference in the foot; abduction and adduction are defined relative to it.
Dorsal interossei ___ digits while plantar interossei ___ digits.	FILL	abduct; adduct	DAB-PAD: Dorsal interossei ABduct, Plantar interossei ADduct relative to the second digit axis.
The muscles on the dorsum of the foot are innervated by which nerve?	Medial plantar nerve	Lateral plantar nerve	Deep fibular nerve	Superficial fibular nerve	C	The deep fibular nerve supplies extensor digitorum brevis and extensor hallucis brevis on the dorsum.
There are ___ dorsal interossei and ___ plantar interossei in the foot.	FILL	4; 3	Four dorsal interossei (abductors) fill four spaces; three plantar interossei (adductors) for digits 3–5.
`.trim(),

28: `
The brain is composed of the cerebrum, cerebellum, diencephalon, and ___.	FILL	brainstem	The brainstem (midbrain, pons, medulla) is the fourth main division of the brain.
Which sulcus divides the frontal lobe from the parietal lobe?	Lateral sulcus	Parieto-occipital sulcus	Central sulcus	Calcarine sulcus	C	The central sulcus (fissure of Rolando) separates the frontal and parietal lobes.
The subarachnoid space is located between the ___ mater and the ___ mater.	FILL	pia; arachnoid	CSF circulates in the subarachnoid space between the delicate pia mater and the arachnoid mater.
The tentorium cerebelli separates which two brain structures?	Left and right cerebral hemispheres	Midbrain and pons	Occipital lobe and cerebellum	Left and right hemispheres of the cerebellum	C	The tentorium cerebelli is a dural fold that forms a tent separating occipital lobes from cerebellum.
The superior sagittal sinus is located along the ___ border of the falx cerebri.	FILL	superior	The superior sagittal sinus runs in the superior (attached) margin of the falx cerebri.
The spinal cord tapers at which vertebral level?	T12/L1	L1/L2	L2/L3	L4/L5	B	The spinal cord ends as the conus medullaris at the L1/L2 disc level in adults.
Blood supply to the brain comes from the internal carotid arteries and the ___ arteries.	FILL	vertebral	Vertebral arteries join to form the basilar artery, together with carotid arteries supplying the brain.
The collection of spinal nerves below L1/L2 is called the ___.	FILL	cauda equina	Below the conus, lumbar and sacral nerve roots descend as the cauda equina (horse's tail).
`.trim(),

29: `
How many pairs of cranial nerves branch from the inferior surface of the brain?	10	11	12	13	C	There are exactly 12 pairs of cranial nerves (CN I–XII) emerging from the brain's inferior surface.
Unlike spinal nerves, cranial nerves may carry only ___ information, only ___ information, or both.	FILL	motor; sensory	Some CNs are purely motor (e.g., CN III), some purely sensory (e.g., CN I), some mixed.
Cranial nerves are numbered using Roman Numerals ___ through ___.	FILL	I; XII	By convention, the 12 cranial nerves are numbered I (olfactory) through XII (hypoglossal).
Spinal nerves differ from cranial nerves in that each spinal nerve carries:	Only motor information	Only sensory information	A mixture of both sensory and motor information	Autonomic information only	C	Every spinal nerve has dorsal (sensory) and ventral (motor) roots, making each one mixed.
Cranial nerves branch from the ___ surface of the brain.	FILL	inferior	All 12 cranial nerves exit from the inferior (ventral) surface of the brain or brainstem.
There are ___ pairs of spinal nerves that branch from the spinal cord.	FILL	31	31 pairs arise from cervical (8), thoracic (12), lumbar (5), sacral (5), and coccygeal (1) levels.
Which of the following statements about cranial nerves is TRUE?	All cranial nerves carry both sensory and motor information	Cranial nerves are numbered using Arabic numerals	Some cranial nerves carry only motor or only sensory information	There are 10 pairs of cranial nerves	C	Unlike spinal nerves, individual cranial nerves can be purely motor, purely sensory, or mixed.
The 12 cranial nerves branch from the inferior surface of the brain and are numbered ___ through ___.	FILL	I; XII	Cranial nerves span from CN I (olfactory) at the cerebrum to CN XII (hypoglossal) at the medulla.
`.trim()
};
