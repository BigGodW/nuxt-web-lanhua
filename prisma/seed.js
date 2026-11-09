/* eslint-disable no-console */
import { PrismaClient } from '@prisma/client'
import { randomBytes, scryptSync } from 'node:crypto'

const prisma = new PrismaClient()

function hashPassword(password) {
  const salt = randomBytes(16).toString('hex')
  return `${salt}:${scryptSync(password, salt, 64).toString('hex')}`
}

const categories = [
  {
    name: '春兰',
    slug: 'chunlan',
    subtitle: '一茎一花 · 幽香清远',
    cover: 'https://wubugimg.orchids.com.cn/uploads/orchid/202611/20261109-orchid-1-e061f42c.jpg',
    description:
      '春兰又名草兰、山兰，叶片细窄而柔韧，花期在立春前后，一茎一花，偶有双花。香气清而不烈，历来被视为国兰之正宗，江浙一带的“老八种”更是兰人案头清供的经典。',
    sortOrder: 1
  },
  {
    name: '蕙兰',
    slug: 'huilan',
    subtitle: '一茎多花 · 气韵高华',
    cover: 'https://wubugimg.orchids.com.cn/uploads/orchid/202611/20261109-orchid-2-3347d563.jpg',
    description:
      '蕙兰又称九节兰、一茎九花，叶姿挺拔，花葶高出众草，一茎着花五六朵至十余朵。花有赤壳、绿壳之分，香气浓郁持久，古人以其“蕙质兰心”比德君子。',
    sortOrder: 2
  },
  {
    name: '建兰',
    slug: 'jianlan',
    subtitle: '夏秋吐芳 · 四季常青',
    cover: 'https://wubugimg.orchids.com.cn/uploads/orchid/202611/20261109-orchid-3-cf88b052.jpg',
    description:
      '建兰原产福建、广东一带，叶幅宽阔而有光泽，夏秋之间多次开花，故又称四季兰、秋兰。性健易养，香气清甜，是初入兰门者最宜亲近的品类。',
    sortOrder: 3
  },
  {
    name: '墨兰',
    slug: 'molan',
    subtitle: '报岁迎春 · 叶阔花深',
    cover: 'https://wubugimg.orchids.com.cn/uploads/orchid/202611/20261109-orchid-4-c00656b2.jpg',
    description:
      '墨兰又称报岁兰，叶宽厚而深绿，花期恰在春节前后，花色由紫褐至墨紫，气度沉稳。岭南人家常以墨兰一盆迎新岁，取“岁朝清供”之意。',
    sortOrder: 4
  },
  {
    name: '寒兰',
    slug: 'hanlan',
    subtitle: '寒冬独秀 · 清瘦孤高',
    cover: 'https://wubugimg.orchids.com.cn/uploads/orchid/202611/20261109-orchid-5-dc6aac07.jpg',
    description:
      '寒兰于深秋至初冬开花，叶形修长，花葶细劲，花瓣狭长而疏朗，香气冷冽。因其不畏霜寒、花叶俱瘦，被视作兰中高士。',
    sortOrder: 5
  },
  {
    name: '春剑',
    slug: 'chunjian',
    subtitle: '川中名品 · 气势挺拔',
    cover: 'https://wubugimg.orchids.com.cn/uploads/orchid/202611/20261109-orchid-6-2f06a487.jpg',
    description:
      '春剑产于四川、贵州一带，叶姿直立如剑，花葶挺拔，一茎着花二三朵。瓣质厚实，花色丰富，川兰素心与梅瓣名品多出于此。',
    sortOrder: 6
  },
  {
    name: '莲瓣兰',
    slug: 'lianbanlan',
    subtitle: '滇西仙草 · 瓣如莲萼',
    cover: 'https://wubugimg.orchids.com.cn/uploads/orchid/202611/20261109-orchid-1-e061f42c.jpg',
    description:
      '莲瓣兰主产云南滇西，花瓣质薄而微卷，形似莲萼，故名。花开于冬春之交，花色以白、粉、藕荷为多，素心与奇花品种尤受藏家珍视。',
    sortOrder: 7
  }
]

const orchids = [
  {
    name: '宋梅',
    alias: '宋锦璇梅',
    slug: 'songmei',
    categorySlug: 'chunlan',
    cover: 'https://wubugimg.orchids.com.cn/uploads/orchid/202611/20261109-orchid-1-e061f42c.jpg',
    images: ['https://wubugimg.orchids.com.cn/uploads/orchid/202611/20261109-orchid-1-e061f42c.jpg', 'https://wubugimg.orchids.com.cn/uploads/orchid/202611/20261109-orchid-2-3347d563.jpg'],
    summary: '春兰梅瓣之冠，瓣质厚糯，蚕蛾捧、如意舌，二百年来被奉为春兰标准器。',
    origin: '浙江绍兴',
    flowering: '2 月—3 月',
    fragrance: '幽香清远',
    difficulty: '中等',
    light: '半阴散射光',
    tags: ['梅瓣', '春兰老八种', '经典名品'],
    isFeatured: true,
    sortOrder: 1,
    content: `<p>宋梅，清乾隆年间由浙江绍兴宋锦璇自山采得，因花形端正、瓣质厚糯，被尊为春兰梅瓣之冠。兰界素有“宋梅出，而春兰之格定”之说，二百余年来始终是品评春兰的标尺。</p>
<h3>花品特征</h3>
<p>外三瓣紧圆，收根放角，瓣肉厚而糯，色如嫩绿泛白；蚕蛾捧心，捧背有浅红晕；如意舌短而圆，舌面红斑成块，端正不卷。花葶细长，高约十五厘米，亭亭出架，一茎一花，气度从容。</p>
<blockquote>兰之品格，不在花色之艳，而在瓣形之正、香气之远。宋梅之可贵，正在一个“正”字。</blockquote>
<h3>栽培要点</h3>
<p>宋梅根细而密，喜疏松透气的颗粒植料，忌积水。春秋两季可置于通风良好的半阴处，夏季遮光六成以上，冬季不低于零下三度即可安全越冬。花前适当控水，可使花葶拔高、瓣形舒展。</p>
<h3>鉴赏小记</h3>
<p>选购时宜看瓣根是否收得干净、捧心是否起兜、舌面红斑是否成块而不散。市场上以“宋梅”之名流通的草不在少数，花品与叶姿需并看，方能辨其真伪。</p>`
  },
  {
    name: '龙字',
    alias: '姚一色',
    slug: 'longzi',
    categorySlug: 'chunlan',
    cover: 'https://wubugimg.orchids.com.cn/uploads/orchid/202611/20261109-orchid-3-cf88b052.jpg',
    images: ['https://wubugimg.orchids.com.cn/uploads/orchid/202611/20261109-orchid-3-cf88b052.jpg'],
    summary: '春兰四大名种之一，荷形水仙瓣，花色嫩绿带朱丝，被誉为“色花之祖”。',
    origin: '浙江余姚',
    flowering: '2 月—3 月',
    fragrance: '浓香',
    difficulty: '中等',
    light: '半阴散射光',
    tags: ['水仙瓣', '春兰四大名种', '色花'],
    isFeatured: true,
    sortOrder: 2,
    content: `<p>龙字出自浙江余姚，与宋梅、集圆、万字并称春兰“四大名种”。其花形介于荷瓣与水仙瓣之间，外三瓣阔而微收，瓣尖起兜，花色嫩绿中透出淡淡朱丝，是国兰中难得的有色名品。</p>
<h3>花品特征</h3>
<p>外三瓣圆阔，收根细，瓣尖微翘；捧心为软兜浅捧，舌为刘海舌，舌面朱点鲜明。花葶高挺，一茎一花，花径可达六厘米，在春兰中属大花型。叶姿半垂，叶幅较宽，叶色深绿有光。</p>
<h3>栽培要点</h3>
<p>龙字长势强健，适应性好，但仍需注意夏季通风与遮阴。植料以植金石、松树皮、仙土混合为宜，颗粒直径五至十毫米。生长期每半月施一次薄肥，花后及时剪去残葶，减少养分消耗。</p>
<h3>鉴赏小记</h3>
<p>龙字之妙，在半绿半朱之间。光照过强则花色偏黄，过阴则瓣薄而色淡，故养龙字者常说“养色先养光”。</p>`
  },
  {
    name: '大富贵',
    alias: '郑同荷',
    slug: 'dafugui',
    categorySlug: 'chunlan',
    cover: 'https://wubugimg.orchids.com.cn/uploads/orchid/202611/20261109-orchid-4-c00656b2.jpg',
    images: ['https://wubugimg.orchids.com.cn/uploads/orchid/202611/20261109-orchid-4-c00656b2.jpg'],
    summary: '春兰荷瓣代表，外三瓣宽厚如荷，收根放角，气势端严富丽。',
    origin: '浙江绍兴',
    flowering: '2 月—3 月',
    fragrance: '清香',
    difficulty: '中等',
    light: '半阴散射光',
    tags: ['荷瓣', '春兰名品', '大花'],
    isFeatured: true,
    sortOrder: 3,
    content: `<p>大富贵又名郑同荷，清末出于浙江绍兴，是春兰荷瓣中的经典。其花瓣宽厚，形如初绽之荷，色翠而润，花容端严，最合“富贵不能淫”的中正之气。</p>
<h3>花品特征</h3>
<p>外三瓣宽圆，瓣肉厚，收根极细，放角明显；捧心短圆，为典型蚌壳捧；大圆舌，舌面红斑呈“U”形，色彩浓艳。花葶不高，常与叶面齐平，故赏花时需俯身近观。</p>
<h3>栽培要点</h3>
<p>荷瓣花多瓣厚，花期消耗大，花前应保证充足光照与磷钾肥。大富贵根粗而少，植料宜稍粗，盆底垫以颗粒，避免闷根。梅雨季节注意防软腐，发现叶基发黄应及时翻盆。</p>
<h3>鉴赏小记</h3>
<p>荷瓣之贵，贵在“收根放角”四字。大富贵瓣根收得干净利落，放角处圆而不钝，是学看荷瓣最好的范本。</p>`
  },
  {
    name: '程梅',
    alias: '程字梅',
    slug: 'chengmei',
    categorySlug: 'huilan',
    cover: 'https://wubugimg.orchids.com.cn/uploads/orchid/202611/20261109-orchid-2-3347d563.jpg',
    images: ['https://wubugimg.orchids.com.cn/uploads/orchid/202611/20261109-orchid-2-3347d563.jpg'],
    summary: '蕙兰老八种之首，赤壳梅瓣，瓣厚如铜钱，气势雄浑，为蕙兰标准器。',
    origin: '江苏常熟',
    flowering: '3 月—4 月',
    fragrance: '浓香持久',
    difficulty: '较高',
    light: '半阴散射光',
    tags: ['梅瓣', '蕙兰老八种', '赤壳'],
    isFeatured: true,
    sortOrder: 4,
    content: `<p>程梅，清乾隆年间由江苏常熟程姓医师选出，为蕙兰“老八种”之首。其瓣质厚实如铜钱，花色深绿带赤，花容雄伟，一茎着花七八朵，开时如列阵而立，最具蕙兰气象。</p>
<h3>花品特征</h3>
<p>外三瓣紧边、厚肉、收根，瓣尖有尖锋；分窠蚕蛾捧，捧心起兜；大如意舌，舌面红斑成块。花葶高可达四十厘米，出架有力，小花柄长而挺，花朵间距疏朗。</p>
<blockquote>养蕙如养士，需宽其地、厚其土、缓其成。程梅尤忌急功，草未壮而强求花，花必失形。</blockquote>
<h3>栽培要点</h3>
<p>蕙兰根系发达，盆宜深、植料宜粗，成株需较大的生长空间。程梅喜光但畏烈日，春秋可全日照，夏季需遮光七成。因其花葶高，花期应立支柱防风折。</p>
<h3>鉴赏小记</h3>
<p>看程梅先看瓣肉，厚者佳；再看捧心，兜深者为上；最后看舌斑，块状鲜明者为真。蕙兰以“气”取胜，弱草之花虽形似而神不足。</p>`
  },
  {
    name: '大一品',
    alias: '绿壳大荷花',
    slug: 'dayipin',
    categorySlug: 'huilan',
    cover: 'https://wubugimg.orchids.com.cn/uploads/orchid/202611/20261109-orchid-6-2f06a487.jpg',
    images: ['https://wubugimg.orchids.com.cn/uploads/orchid/202611/20261109-orchid-6-2f06a487.jpg'],
    summary: '蕙兰绿壳荷形水仙瓣，花大如掌，为蕙兰中花径最大者之一。',
    origin: '浙江富阳',
    flowering: '3 月—5 月',
    fragrance: '醇正浓香',
    difficulty: '中等',
    light: '半阴散射光',
    tags: ['水仙瓣', '蕙兰老八种', '大花'],
    isFeatured: true,
    sortOrder: 5,
    content: `<p>大一品出于浙江富阳，为蕙兰绿壳类荷形水仙瓣代表。花径可达八厘米，一茎着花六七朵，花开时如白鹤展翅，是蕙兰中难得的“大格”之花。</p>
<h3>花品特征</h3>
<p>外三瓣阔大而收根，瓣尖微兜，色翠绿泛白；软蚕蛾捧，捧心圆润；大刘海舌，舌面红斑疏朗。花葶高挺，小花柄长，花朵排列疏密有致，整体气息舒展。</p>
<h3>栽培要点</h3>
<p>大一品草势强，需肥量较一般蕙兰略多，但忌浓肥。春秋两季可薄肥勤施，夏季停肥。因其花大，花期应避免空调直吹与频繁搬动，以免花容早谢。</p>
<h3>鉴赏小记</h3>
<p>“一品”之名，取花格之高。赏大一品，宜退后三步观其整体气势，再近前细看瓣形，方能体会其舒展大方之美。</p>`
  },
  {
    name: '铁骨素',
    alias: '素心建兰',
    slug: 'tiegusu',
    categorySlug: 'jianlan',
    cover: 'https://wubugimg.orchids.com.cn/uploads/orchid/202611/20261109-orchid-5-dc6aac07.jpg',
    images: ['https://wubugimg.orchids.com.cn/uploads/orchid/202611/20261109-orchid-5-dc6aac07.jpg'],
    summary: '建兰素心名品，叶硬如铁，花白如玉，香气清甜，最宜新手入门。',
    origin: '福建漳州',
    flowering: '6 月—10 月',
    fragrance: '清甜幽香',
    difficulty: '较易',
    light: '明亮散射光',
    tags: ['素心', '建兰', '易养'],
    isFeatured: true,
    sortOrder: 6,
    content: `<p>铁骨素是建兰素心中的老牌名品，叶质硬挺如铁，花色纯净无斑，故名。其性健易养、开花勤勉，夏秋之间可连开数次，是许多兰人案头的第一盆兰。</p>
<h3>花品特征</h3>
<p>叶幅窄而直立，叶色深绿，叶面有光泽，触之坚挺。花葶出架，一茎着花五至九朵，花瓣狭长，色白微绿，唇瓣纯白无斑点。香气清甜，傍晚尤盛。</p>
<h3>栽培要点</h3>
<p>建兰喜温暖湿润，生长适温十八至三十度。植料可用松树皮、火山石、腐叶土混合，保持“润而不湿”。夏季需遮光五成，冬季移入室内，不低于五度即可越冬。</p>
<h3>鉴赏小记</h3>
<p>素心之美，在于“净”。花瓣、捧心、唇瓣皆无杂色，才称得上真正的素心。市场上常有“素花”冒充素心，需看唇瓣是否纯白无点。</p>`
  },
  {
    name: '夏皇梅',
    alias: '建兰梅瓣',
    slug: 'xiahuangmei',
    categorySlug: 'jianlan',
    cover: 'https://wubugimg.orchids.com.cn/uploads/orchid/202611/20261109-orchid-3-cf88b052.jpg',
    images: ['https://wubugimg.orchids.com.cn/uploads/orchid/202611/20261109-orchid-3-cf88b052.jpg'],
    summary: '建兰梅瓣代表，花色黄绿，捧心起兜，夏秋开花，香韵兼备。',
    origin: '广东顺德',
    flowering: '7 月—9 月',
    fragrance: '浓香',
    difficulty: '较易',
    light: '明亮散射光',
    tags: ['梅瓣', '建兰', '夏花'],
    isFeatured: false,
    sortOrder: 7,
    content: `<p>夏皇梅出自广东顺德，是建兰中难得的梅瓣品种。花呈黄绿色，外三瓣紧边厚肉，捧心起兜，形神俱似春兰梅瓣，却开在盛夏，故有“夏皇”之称。</p>
<h3>花品特征</h3>
<p>外三瓣短圆，收根放角，瓣尖有锋；蚕蛾捧，捧心紧抱；如意舌，舌面红斑成块。花葶高约二十五厘米，一茎着花五至七朵，花色金黄带绿，阳光下颇为夺目。</p>
<h3>栽培要点</h3>
<p>夏皇梅花期正值高温，需加强通风，避免闷热导致消苞。浇水宜在清晨或傍晚，正午忌浇。花后及时补充均衡肥，为下一茬花积累养分。</p>
<h3>鉴赏小记</h3>
<p>建兰梅瓣较少，夏皇梅之贵在于“形”与“时”——既有春兰之瓣形，又能在暑月送来清香。</p>`
  },
  {
    name: '企黑',
    alias: '黑墨兰',
    slug: 'qihei',
    categorySlug: 'molan',
    cover: 'https://wubugimg.orchids.com.cn/uploads/orchid/202611/20261109-orchid-4-c00656b2.jpg',
    images: ['https://wubugimg.orchids.com.cn/uploads/orchid/202611/20261109-orchid-4-c00656b2.jpg'],
    summary: '墨兰经典，叶阔直立，花色深紫近墨，春节前后开花，为岭南年花首选。',
    origin: '广东顺德',
    flowering: '1 月—2 月',
    fragrance: '浓香',
    difficulty: '较易',
    light: '半阴散射光',
    tags: ['墨兰', '年花', '紫花'],
    isFeatured: true,
    sortOrder: 8,
    content: `<p>企黑是墨兰中的老牌品种，叶姿直立如剑，叶色墨绿油亮，花色深紫近黑，故得“企黑”之名。岭南人家春节前购一盆墨兰置于厅堂，取“报岁迎春”之吉。</p>
<h3>花品特征</h3>
<p>叶片宽厚，长约五十厘米，直立而不垂；花葶粗壮，高出叶面，一茎着花八至十五朵。花瓣狭长，色紫褐带暗红，唇瓣有深色斑纹，香气浓郁，可持续月余。</p>
<h3>栽培要点</h3>
<p>墨兰喜温暖，畏严寒，冬季需保持在八度以上。夏季遮光六成，保持环境湿润。花期避免向花朵喷水，以免花瓣出现水渍斑。</p>
<h3>鉴赏小记</h3>
<p>墨兰之美在于“厚”与“稳”。叶要阔而有光，花要色深而不浊，花葶要直而有劲，三者兼具，方称上品。</p>`
  },
  {
    name: '素心寒兰',
    alias: '白舌寒兰',
    slug: 'suxin-hanlan',
    categorySlug: 'hanlan',
    cover: 'https://wubugimg.orchids.com.cn/uploads/orchid/202611/20261109-orchid-5-dc6aac07.jpg',
    images: ['https://wubugimg.orchids.com.cn/uploads/orchid/202611/20261109-orchid-5-dc6aac07.jpg'],
    summary: '寒兰素心，花瓣狭长疏朗，唇瓣纯白，香气冷冽，兰中高士。',
    origin: '江西武夷山',
    flowering: '10 月—12 月',
    fragrance: '冷香幽远',
    difficulty: '稍难',
    light: '半阴散射光',
    tags: ['素心', '寒兰', '冷香'],
    isFeatured: false,
    sortOrder: 9,
    content: `<p>寒兰多产于赣、闽、浙山地，叶形修长，花葶细劲，花瓣狭长而疏。素心寒兰唇瓣纯白，香气冷冽清远，古人以“寒兰一茎，可当一室清友”形容其格调。</p>
<h3>花品特征</h3>
<p>花瓣狭长，宽约一厘米，色淡绿泛白，唇瓣纯白无斑，捧心窄而内抱。花葶高挺，着花五至十朵，花朵疏朗有致，风过时如群鹤振羽。</p>
<h3>栽培要点</h3>
<p>寒兰根系纤细，植料宜细而透气，忌用大颗粒硬植料。喜凉爽通风，夏季需严格遮阴与降温。因其花期在冬初，花前应减少氮肥，增施磷钾，以保花色纯净。</p>
<h3>鉴赏小记</h3>
<p>寒兰重“韵”不重“形”。瓣不必圆，色不必艳，贵在疏朗清瘦、香气悠远。素心者尤以唇瓣纯白如雪为上。</p>`
  },
  {
    name: '西蜀道光',
    alias: '道光素',
    slug: 'xishu-daoguang',
    categorySlug: 'chunjian',
    cover: 'https://wubugimg.orchids.com.cn/uploads/orchid/202611/20261109-orchid-6-2f06a487.jpg',
    images: ['https://wubugimg.orchids.com.cn/uploads/orchid/202611/20261109-orchid-6-2f06a487.jpg'],
    summary: '春剑素心名品，花大瓣厚，色如凝脂，川兰素心之代表。',
    origin: '四川都江堰',
    flowering: '2 月—3 月',
    fragrance: '清香醇正',
    difficulty: '中等',
    light: '半阴散射光',
    tags: ['素心', '春剑', '川兰'],
    isFeatured: true,
    sortOrder: 10,
    content: `<p>西蜀道光为春剑素心名品，相传清末出于四川灌县（今都江堰）一带。花大瓣厚，色如凝脂，唇瓣纯白，是川兰素心中的标杆之作。</p>
<h3>花品特征</h3>
<p>外三瓣长圆，瓣肉厚实，色白绿相间，阳光下有蜡质感；捧心短圆，唇瓣宽白，无任何杂斑。花葶挺拔，高约三十厘米，一茎着花二至四朵，花径可达七厘米。</p>
<h3>栽培要点</h3>
<p>春剑喜湿润凉爽，忌高温高湿。植料以颗粒土为主，盆面可铺薄层水苔保湿。夏季遮光七成，冬季保持零度以上。花前控水可防瓣长发软。</p>
<h3>鉴赏小记</h3>
<p>川兰素心讲究“净、厚、大”三字：唇瓣净、瓣肉厚、花形大。西蜀道光三者兼备，故历来为藏家所重。</p>`
  },
  {
    name: '剑阳蝶',
    alias: '莲瓣蝶花',
    slug: 'jianyang-die',
    categorySlug: 'lianbanlan',
    cover: 'https://wubugimg.orchids.com.cn/uploads/orchid/202611/20261109-orchid-2-3347d563.jpg',
    images: ['https://wubugimg.orchids.com.cn/uploads/orchid/202611/20261109-orchid-1-e061f42c.jpg'],
    summary: '莲瓣兰蝶花名品，捧心唇化如蝶翼，花色粉白带紫纹，滇兰奇花代表。',
    origin: '云南大理',
    flowering: '1 月—2 月',
    fragrance: '清香',
    difficulty: '稍难',
    light: '半阴散射光',
    tags: ['蝶花', '莲瓣兰', '奇花'],
    isFeatured: true,
    sortOrder: 11,
    content: `<p>剑阳蝶产于云南大理，是莲瓣兰中的蝶花名品。其捧心唇化，形如蝶翼舒展，花色粉白而缀紫红条纹，花开时如蝶栖枝，为滇兰奇花之代表。</p>
<h3>花品特征</h3>
<p>外三瓣狭长微卷，形似莲萼，色粉白透紫；双捧唇化，上有浓艳紫红斑块；唇瓣宽大，向后翻卷。花葶细长，一茎着花二至三朵，花姿轻盈灵动。</p>
<h3>栽培要点</h3>
<p>莲瓣兰原生于滇西高海拔山地，喜凉爽、怕酷热。夏季需降温通风，温度不宜超过三十度。植料宜细，保水性要好，空气湿度保持在六成左右。</p>
<h3>鉴赏小记</h3>
<p>蝶花之妙，在于“对称”与“灵动”。双捧唇化程度越高、斑纹越对称，品级越高。剑阳蝶之蝶化稳定，是莲瓣蝶花中的可靠品种。</p>`
  },
  {
    name: '粉荷',
    alias: '莲瓣荷瓣',
    slug: 'fenhe',
    categorySlug: 'lianbanlan',
    cover: 'https://wubugimg.orchids.com.cn/uploads/orchid/202611/20261109-orchid-4-c00656b2.jpg',
    images: ['https://wubugimg.orchids.com.cn/uploads/orchid/202611/20261109-orchid-2-3347d563.jpg'],
    summary: '莲瓣兰荷瓣名品，花瓣粉白如荷，收根放角，滇兰中难得之正格花。',
    origin: '云南保山',
    flowering: '1 月—3 月',
    fragrance: '幽香',
    difficulty: '稍难',
    light: '半阴散射光',
    tags: ['荷瓣', '莲瓣兰', '粉花'],
    isFeatured: false,
    sortOrder: 12,
    content: `<p>粉荷出于云南保山，是莲瓣兰中难得的正格荷瓣。花瓣粉白如初绽之荷，收根放角，捧心圆整，在滇兰中自成一格。</p>
<h3>花品特征</h3>
<p>外三瓣宽圆，瓣质薄而微卷，色粉白透淡紫；捧心短圆内抱，唇瓣宽大，上有淡红斑纹。花葶中等，一茎着花二三朵，花容端秀而不失轻盈。</p>
<h3>栽培要点</h3>
<p>粉荷对湿度要求较高，干燥季节需在盆周喷雾增湿。喜散射光，忌烈日直射。因瓣薄，花期应避免强风与温差骤变，以延长观赏期。</p>
<h3>鉴赏小记</h3>
<p>莲瓣兰以“瓣薄如莲”为美，粉荷之瓣质虽薄而有骨，色淡而不寡，是滇兰中“秀而不弱”的代表。</p>`
  }
]

const articles = [
  {
    title: '国兰之美：一茎一花，香远益清',
    slug: 'guolan-zhimei',
    summary: '国兰之美，不在繁华，而在清、雅、幽、远。从孔子“芝兰生于深林”到今日案头清供，兰始终是中国人心中的君子之花。',
    category: '兰文化',
    cover: 'https://wubugimg.orchids.com.cn/uploads/banner/202611/20261109-banner-2-ba06a4dd.jpg',
    author: '九畹编辑部',
    tags: ['兰文化', '鉴赏'],
    isTop: true,
    content: `<p>中国人爱兰，爱了两千多年。孔子周游列国，于幽谷之中见香兰独茂，叹曰：“兰当为王者香，今乃独茂，与众草为伍。”自此，兰便不只是草木，而成了君子处困境而不改其节的象征。</p>
<h2>一、兰之香：不以无人而不芳</h2>
<p>国兰之香，最是难言。它不像玫瑰那样扑面而来，而是若有若无，忽远忽近。古人称之为“幽香”，又说“香远益清”。一盆春兰置于书房，人在案前不觉其香，推门而入时却有暗香袭来，这正是国兰最动人的地方。</p>
<blockquote>芝兰生于深林，不以无人而不芳；君子修道立德，不为穷困而改节。</blockquote>
<h2>二、兰之形：瓣有定式，叶有姿态</h2>
<p>赏兰先赏瓣。梅瓣取其圆整厚糯，荷瓣取其宽博端庄，水仙瓣取其秀逸灵动，蝶瓣取其奇变对称。外三瓣、捧心、唇瓣，各有法度，构成一套延续数百年的审美体系。叶则讲究“立叶如剑，垂叶如带”，一盆之中，叶姿的疏密俯仰，往往比花更耐看。</p>
<h2>三、兰之德：清供一室，养心养气</h2>
<p>文人养兰，不求其多，只求其清。一几、一盆、一壶茶，便可消磨半日。养兰的过程，是学会等待的过程：等发苗、等孕蕾、等花开，急不得，也躁不得。兰以清雅育人，人以耐心养兰，彼此成全。</p>
<p>今日都市居所狭小，一盆建兰置于窗台，夏秋开花时满室清甜，已足以让人暂忘尘嚣。这或许就是国兰延续千年的秘密——它从不喧哗，却始终在那里。</p>`,
    publishedAt: '2026-03-18'
  },
  {
    title: '春兰、蕙兰、建兰、墨兰、寒兰，一文分清五大国兰',
    slug: 'wuda-guolan-qubie',
    summary: '花友常把春兰与蕙兰混淆，把建兰与墨兰认错。其实只要看花期、花数、叶形三点，就能快速分辨。',
    category: '鉴赏',
    cover: 'https://wubugimg.orchids.com.cn/uploads/orchid/202611/20261109-orchid-2-3347d563.jpg',
    author: '九畹编辑部',
    tags: ['鉴赏', '入门', '品种辨识'],
    isTop: true,
    content: `<p>国兰品类虽多，市面上最常见的还是春兰、蕙兰、建兰、墨兰、寒兰五种。它们的花期、花数、叶形各有特征，掌握以下三点，基本不会认错。</p>
<h2>一、看花期：什么时候开，最不会骗人</h2>
<ul>
<li><strong>春兰</strong>：立春至三月，一茎一花，偶有双花。</li>
<li><strong>蕙兰</strong>：三月至五月，一茎五六朵至十余朵。</li>
<li><strong>建兰</strong>：六月至十月，夏秋多次开花，故称四季兰。</li>
<li><strong>墨兰</strong>：春节前后，一茎八至十五朵，花色深紫。</li>
<li><strong>寒兰</strong>：十月至十二月，花葶细长，花瓣狭而疏。</li>
</ul>
<h2>二、看花数：一茎一花还是多花</h2>
<p>春兰与春剑多为一茎一花（春剑偶有二至三朵），而蕙兰、建兰、墨兰、寒兰均为多花。若在春天看到一茎九花、花葶高挺的，多半是蕙兰。</p>
<h2>三、看叶形：宽厚、细窄、直立还是半垂</h2>
<p>墨兰叶最宽最厚，色深而有光；建兰叶幅中等，姿态半垂；蕙兰叶长而挺，叶缘常有细齿；春兰叶细窄柔韧，叶姿优美；寒兰叶最修长，叶面较薄。</p>
<blockquote>口诀：春兰一茎一朵花，蕙兰九节气韵华；建兰夏秋开不断，墨兰报岁叶宽大；寒兰瘦叶迎霜立，五兰辨清不误差。</blockquote>
<h2>四、新手该从哪种养起</h2>
<p>若所在地区冬季不太冷，建议从建兰入手，如铁骨素、夏皇梅，性健勤花；南方可尝试墨兰；有暖气或冬季室内温度稳定的，可以养春兰。蕙兰与寒兰对空间和通风要求更高，宜在有经验后再入手。</p>`,
    publishedAt: '2026-02-26'
  },
  {
    title: '新手养兰：从选苗、上盆到服盆的完整指南',
    slug: 'xinshou-yanglan-zhinan',
    summary: '养兰第一年最容易犯的三个错误：盆太大、土太细、水太勤。避开这三点，成活率能提高一大半。',
    category: '养护',
    cover: 'https://wubugimg.orchids.com.cn/uploads/orchid/202611/20261109-orchid-3-cf88b052.jpg',
    author: '九畹编辑部',
    tags: ['养护', '入门', '上盆'],
    isTop: false,
    content: `<p>兰花并不娇气，但它对“根”的要求极高。国兰的根是肉质气生根，既要湿润，又要呼吸。绝大多数养死兰花的案例，问题都出在根上。</p>
<h2>一、选苗：看根、看叶、看芦头</h2>
<p>好苗的标准是：根系白净饱满、无黑腐；叶片挺括有光、无斑点；芦头（假鳞茎）饱满充实。网购苗要问清是否“下山草”或“组培苗”，前者需长时间服盆，后者性状稳定但需注意适应期。</p>
<h2>二、植料：颗粒为主，透气第一</h2>
<p>推荐配比：松树皮 40%、植金石 30%、火山石 20%、腐叶土 10%。颗粒直径五至十毫米为宜。切忌使用园土或细泥，那是兰花烂根的元凶。</p>
<h2>三、上盆：盆不宜大，根要舒展</h2>
<p>盆径以根系能自然舒展为准，宁可小一号。上盆时先在盆底垫一层大颗粒，将根系理顺放入，边填植料边轻拍盆壁，使植料与根密接。芦头露出植料三分之一，切勿深埋。</p>
<blockquote>养兰口诀：盆要小，土要粗，水要少，风要多。</blockquote>
<h2>四、服盆：遮阴、控水、不施肥</h2>
<p>上盆后置于通风阴凉处，两周内不施肥，保持植料微润即可。约一个月后，新芽开始萌动，说明已经服盆。此时可逐渐增加光照，恢复正常的肥水管理。</p>
<h2>五、常见问题</h2>
<ul>
<li><strong>叶片发黄</strong>：多为积水闷根，需检查植料透气性。</li>
<li><strong>叶尖焦枯</strong>：空气过干或施肥过浓。</li>
<li><strong>长期不发新芽</strong>：光照不足或植料板结，可考虑翻盆。</li>
</ul>`,
    publishedAt: '2026-02-10'
  },
  {
    title: '浇水与植料：把“干兰湿菊”说清楚',
    slug: 'jiaoshui-yu-zhiliao',
    summary: '“干兰湿菊”不是让兰花一直干着，而是指兰根需要干湿交替。掌握三个判断方法，浇水不再靠猜。',
    category: '养护',
    cover: 'https://wubugimg.orchids.com.cn/uploads/banner/202611/20261109-banner-3-d396c71e.jpg',
    author: '九畹编辑部',
    tags: ['养护', '浇水', '植料'],
    isTop: false,
    content: `<p>“干兰湿菊”是流传最广的养兰口诀，也是最容易被误读的一句。它的本意是：兰花喜润而畏涝，根系需要在“湿—干—湿”的循环中呼吸，而不是长期泡在水里。</p>
<h2>一、什么时候浇：三个判断方法</h2>
<ul>
<li><strong>掂盆法</strong>：浇透后记住盆的重量，变轻三成左右即可再浇。</li>
<li><strong>插签法</strong>：将竹签插入盆土三分之二，拔出后若带湿痕则暂缓。</li>
<li><strong>看叶法</strong>：叶面失去光泽、叶尖微垂，是缺水的信号。</li>
</ul>
<h2>二、怎么浇：一次浇透，不留半截水</h2>
<p>浇水要缓慢、均匀，直到盆底流出水为止。长期“半截水”会导致下层根系缺水、上层过湿，是烂根与空根的常见原因。自来水可静置一夜再用，冬季水温应与室温接近。</p>
<h2>三、植料决定浇水频率</h2>
<p>颗粒粗、透气好的植料干得快，夏季可能一两天就需要浇；细植料保水强，三至五天一次即可。因此不存在“几天浇一次”的标准答案，只有“看植料、看环境、看季节”。</p>
<blockquote>宁干勿湿，是新手最安全的策略。干一点的兰只会慢，湿过头的兰会死。</blockquote>
<h2>四、季节差异</h2>
<p>春季生长期需水量大，保持微润；夏季高温蒸发快，清晨浇水、傍晚喷雾；秋季适当控水，促进花芽分化；冬季低温，盆土宜偏干，避免冻害。</p>`,
    publishedAt: '2026-01-22'
  },
  {
    title: '兰花瓣型鉴赏：梅、荷、水仙、蝶，好在哪里',
    slug: 'lanhua-banxing-jianshang',
    summary: '梅瓣贵在厚糯，荷瓣贵在宽博，水仙瓣贵在秀逸，蝶瓣贵在对称。看懂瓣型，才算真正入门国兰。',
    category: '鉴赏',
    cover: 'https://wubugimg.orchids.com.cn/uploads/orchid/202611/20261109-orchid-2-3347d563.jpg',
    author: '九畹编辑部',
    tags: ['鉴赏', '瓣型', '入门'],
    isTop: false,
    content: `<p>国兰的审美，建立在“瓣型”之上。同样的花色，瓣形不同，品级可能相差十倍。理解瓣型，是进入国兰世界的第一把钥匙。</p>
<h2>梅瓣：圆整厚糯，如梅初绽</h2>
<p>外三瓣短圆、紧边、厚肉，瓣尖有锋；捧心起兜，形似蚕蛾；舌短而圆。代表品种有春兰宋梅、蕙兰程梅。梅瓣之贵，贵在“糯”——瓣质如糯米般细腻而有韧性。</p>
<h2>荷瓣：宽博端庄，如荷出水</h2>
<p>外三瓣宽大、收根放角，瓣质厚润；捧心短圆如蚌壳；舌大而圆。代表品种有春兰大富贵、莲瓣兰粉荷。荷瓣讲究“一寸之阔”，气势要足。</p>
<h2>水仙瓣：秀逸灵动，介于梅荷之间</h2>
<p>外三瓣比梅瓣长、比荷瓣窄，瓣尖起兜，形似水仙花瓣。代表品种有春兰龙字、蕙兰大一品。水仙瓣之美在于“俏”，过圆则近梅，过长则失格。</p>
<h2>蝶瓣：奇变对称，如蝶栖枝</h2>
<p>捧心或唇瓣发生唇化、蝶化，形成左右对称的斑块。代表品种有莲瓣兰剑阳蝶。蝶瓣以外瓣、捧瓣蝶化稳定、斑纹对称者为上。</p>
<blockquote>看瓣先看形，再看质，最后看神。形可学，质难得，神则需多年眼力。</blockquote>
<h2>素心与非素心</h2>
<p>凡唇瓣、捧心无杂色斑点者称“素心”，反之称“彩心”。素心兰历来被视为兰中清品，价格也往往更高。但素心不等于名品，仍需结合瓣形综合判断。</p>`,
    publishedAt: '2026-01-08'
  },
  {
    title: '兰室清供：文人书房里的一盆兰',
    slug: 'lanshi-qinggong',
    summary: '一几一盆一炉香。兰花如何从山野走入书房，成为中国人精神生活的一部分。',
    category: '兰文化',
    cover: 'https://wubugimg.orchids.com.cn/uploads/banner/202611/20261109-banner-2-ba06a4dd.jpg',
    author: '九畹编辑部',
    tags: ['兰文化', '书房', '清供'],
    isTop: false,
    content: `<p>宋人赵希鹄在《洞天清录》中列“清供”诸品，兰居其一。明清以降，文人在书房中置兰一盆，配以奇石、古砚、香炉，构成一个自足的精神世界。</p>
<h2>一、位置：近窗而不当风</h2>
<p>兰喜散射光，书房中东窗、南窗之下最宜。忌置于空调出风口与暖气片旁，也不宜长期放在无光的角落。案头赏花，花后可移至阳台养护，来年再入室。</p>
<h2>二、盆器：素雅为上</h2>
<p>宜兴紫砂盆、青瓷盆、粗陶盆皆可，以素面、线条简净者为佳。盆色不宜过艳，以免喧宾夺主。盆面可铺薄层青苔或植金石，既保湿又添野趣。</p>
<h2>三、搭配：石、几、画</h2>
<p>一盆兰，配一方太湖石或英石，置于旧木几上，背后挂一幅水墨兰竹，便是一幅立体的画。器物不必名贵，贵在气息相合。</p>
<blockquote>室有兰，则不俗；心有兰，则不躁。</blockquote>
<h2>四、清供的时节</h2>
<p>冬春之交供春兰、墨兰，夏秋供建兰，深秋供寒兰。四时有序，案头常新。这也是中国人“寄情于物”的日常实践。</p>`,
    publishedAt: '2025-12-20'
  }
]

const banners = [
  {
    title: '一茎一花，香远益清',
    subtitle: '九畹 · 国兰清赏｜汇集春兰、蕙兰、建兰、墨兰、寒兰诸品',
    image: 'https://wubugimg.orchids.com.cn/uploads/banner/202611/20261109-banner-1-cbd3da2a.jpg',
    link: '/orchids',
    sortOrder: 1
  },
  {
    title: '芝兰生于深林，不以无人而不芳',
    subtitle: '从山野到案头，读懂中国人的兰花情结',
    image: 'https://wubugimg.orchids.com.cn/uploads/banner/202611/20261109-banner-2-ba06a4dd.jpg',
    link: '/articles/lanshi-qinggong',
    sortOrder: 2
  },
  {
    title: '夏秋吐芳，一室清甜',
    subtitle: '建兰专题｜新手最容易养好的国兰',
    image: 'https://wubugimg.orchids.com.cn/uploads/banner/202611/20261109-banner-3-d396c71e.jpg',
    link: '/categories/jianlan',
    sortOrder: 3
  }
]

const settings = {
  siteName: '九畹',
  siteFullName: '九畹 · 国兰清赏',
  slogan: '一茎一花，香远益清',
  description:
    '九畹国兰清赏，专注中国兰花（国兰）的品种整理与鉴赏普及，收录春兰、蕙兰、建兰、墨兰、寒兰、春剑、莲瓣兰等名品，并提供养护知识与兰文化文章。',
  keywords: '国兰,春兰,蕙兰,建兰,墨兰,寒兰,兰花品种,兰花养护,兰文化',
  about:
    '九畹之名，取自屈原《离骚》“余既滋兰之九畹兮，又树蕙之百亩”。我们以兰为友，整理国兰名品谱系，记录瓣型、花期、香气与养护要点，也收录与兰相关的文化与生活。愿这一方小小的兰畹，能让更多人在喧嚣中闻到一缕清芬。',
  contactPerson: '九畹编辑部',
  phone: '0571-8888 6666',
  email: 'hello@jiuwan-orchid.cn',
  wechat: 'jiuwan_orchid',
  address: '浙江省杭州市西湖区兰苑路 9 号',
  icp: '浙ICP备2026000001号',
  copyright: '© 2026 九畹 · 国兰清赏　保留所有权利',
  footerNote: '本站图文仅用于国兰文化传播，部分品种资料参考《中国兰艺》及相关兰谱，欢迎兰友指正。',
  statYears: '20',
  statVarieties: '120',
  statArticles: '80'
}

async function main() {
  /* 管理员 */
  const exists = await prisma.user.findUnique({ where: { username: 'admin' } })
  if (!exists) {
    await prisma.user.create({
      data: {
        username: 'admin',
        password: hashPassword('admin123'),
        nickname: '兰畹主人',
        role: 'ADMIN'
      }
    })
    console.log('✓ 已创建管理员 admin / admin123')
  }

  /* 品类 */
  const categoryMap = {}
  for (const item of categories) {
    const category = await prisma.category.upsert({
      where: { slug: item.slug },
      update: item,
      create: item
    })
    categoryMap[item.slug] = category.id
  }
  console.log(`✓ 品类 ${categories.length} 条`)

  /* 品种 */
  for (const item of orchids) {
    const { categorySlug, ...rest } = item
    const data = { ...rest, categoryId: categoryMap[categorySlug] }
    await prisma.orchid.upsert({
      where: { slug: item.slug },
      update: data,
      create: data
    })
  }
  console.log(`✓ 品种 ${orchids.length} 条`)

  /* 文章 */
  for (const item of articles) {
    const data = { ...item, publishedAt: new Date(item.publishedAt) }
    await prisma.article.upsert({
      where: { slug: item.slug },
      update: data,
      create: data
    })
  }
  console.log(`✓ 文章 ${articles.length} 条`)

  /* 轮播（无唯一键，仅在为空时初始化） */
  if ((await prisma.banner.count()) === 0) {
    await prisma.banner.createMany({ data: banners })
    console.log(`✓ 轮播 ${banners.length} 条`)
  }

  /* 站点配置 */
  for (const [key, value] of Object.entries(settings)) {
    await prisma.setting.upsert({
      where: { key },
      update: { value: String(value) },
      create: { key, value: String(value) }
    })
  }
  console.log(`✓ 站点配置 ${Object.keys(settings).length} 项`)

  console.log('\n初始化完成，启动 npm run dev 即可预览。')
}

main()
  .catch((error) => {
    console.error('种子数据写入失败：', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
