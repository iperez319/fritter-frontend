<template>
    <DetailPage type="Freet" :postId="this.$route.params.freetId"/>
</template>

<script>

import DetailPage from '@/components/common/DetailPage.vue';
export default {
    name: 'FreetDetailPage',
    components: {DetailPage},
}

</script>