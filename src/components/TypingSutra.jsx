import React from 'react'
import { motion } from 'framer-motion'

const lines = [
  '观自在菩萨，行深般若波罗蜜多时，照见五蕴皆空，度一切苦厄。',
  '舍利子，色不异空，空不异色；色即是空，空即是色；受想行识，亦复如是。',
  '舍利子，是诸法空相，不生不灭，不垢不净，不增不减。',
  '是故空中无色，无受想行识；无眼耳鼻舌身意，无色声香味触法；',
  '无眼界，乃至无意识界；无无明，亦无无明尽，乃至无老死，亦无老死尽；',
  '无苦集灭道，无智亦无得，以无所得故，菩提萨埵，依般若波罗蜜多故，',
  '心无罣碍，无罣碍故，无有恐怖，远离颠倒梦想，究竟涅槃。',
  '三世诸佛，依般若波罗蜜多故，得阿耨多罗三藐三菩提。',
  '故知般若波罗蜜多，是大神咒，是大明咒，是无上咒，是无等等咒，',
  '能除一切苦，真实不虚。',
  '故说般若波罗蜜多咒，即说咒曰：揭谛，揭谛，波罗揭谛，波罗僧揭谛，菩提萨婆诃。'
]

export default function TypingSutra() {
  return (
    <div className="bg-white/80 dark:bg-[#2d2d2d]/80 backdrop-blur-md rounded-xl p-6 max-h-72 overflow-y-auto leading-8 text-[#774F1A] dark:text-[#FEEBC8] text-lg font-serif">
      {lines.map((line, idx) => (
        <motion.p
          key={idx}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: idx * 0.4 }}
          viewport={{ once: true }}
          className="mb-2"
        >
          {line}
        </motion.p>
      ))}
    </div>
  )
} 
 