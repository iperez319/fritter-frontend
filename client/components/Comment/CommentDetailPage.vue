<template>
    <DetailPage type="Comment" :postId="this.$route.params.commentId"/>
</template>

<script>

import DetailPage from '@/components/common/DetailPage.vue';
export default {
    name: 'CommentDetailPage',
    components: {DetailPage},
    mounted() {
        console.log(this.$route.params.commentId)
    }
}

</script>