<template>
  <div class="view__card">
    <div class="title">这是一个标题</div>
    <div class="date">发布日期：2019-06-12 09:44:12</div>
    <div class="content">
      自幼由于家庭蒙受反右迫害，托孤于养父母抚养，成长于普通工人家庭。于1966年小学三年级，历经文革磨难、停课闹革命，被迫在家从干爹刘贵权（北京四大名医施今墨之高足）学习中医八年，学习科别包括内、外、儿、妇；后又从著名正骨专家刘桂鹏学习正骨按摩三年；并拜张琦翔学习医古文五年；后经介绍，拜庞德中学习天文、地理、哲学；其间，又拜针灸泰斗夏寿人为师，学习针灸七年；同时问难于贺普仁、田稔民之门下；并向郝依群学习解剖、生理三年；于1985年受老师之托，帮助扬州高旻寺重建工作，义诊八年。
      虽然遨游于祖国文化与中医各部经典之间，与祖国医学结缘甚深，在二十余年的学习过程中，粗得文义，略有感悟，然未得真谛。从学习临床四十余年之中，颇有心得，领悟甚深，渐明圣贤之伟大，中华民族之伟大，祖国医学之伟大。于2002年，借改革开放之春风，筹建扬州慈心堂医院。
      慈心堂医院不是金砖玉瓦叠摞起来的商品，而是用一颗颗闪光的心聚烁起的文明坐标。她承苍天布运之道；蒙厚土运载之德；传国运明君惠施正治；寄父母良师养育之恩；谢善友相助深情——斯乃慈心堂得以诞生、发展之因果。
      如今，慈心堂正拟二期工程破土动工，将于三年后全体工程启运。届时，慈心堂医院将建一座大讲堂，向社会开宗布道，宣教中医经典著作，以期正本清源，还中华医学以本来面目，是为己愿。
      祈苍天护佑，万众护佑。
    </div>
    <EditFooter></EditFooter>
  </div>
</template>
<script>
import EditFooter from '@/components/EditFooter'
export default {
  components: { EditFooter },
}
</script>
<style lang="scss" scoped>
.title {
  font-size: 20px;
  font-weight: bold;
}
.date {
  font-size: 14px;
  color: #666;
  margin-top: 20px;
  margin-bottom: 40px;
}
.content {
  font-size: 16px;
  color: #333;
  line-height: 36px;
  margin-bottom: 30px;
}
</style>
