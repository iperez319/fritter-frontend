<template>
    <main v-if="post">
        <section>
            <FreetComponent v-if="type == 'Freet'" :freet="post" hideFooter/>
            <CommentComponent v-if="type == 'Comment'" :comment="post" hideFooter />
        </section>
        <section>
            <h2>Comments</h2>
            <section>
                <TextEditor v-model="newCommentContent"/>
                <b-button @click="postComment">Reply</b-button>
            </section>
            <section>
                <CommentComponent v-for="comment in comments" :comment="comment" />
            </section>
        </section>
    </main>
</template>

<script>

import CommentComponent from '@/components/Comment/CommentComponent.vue';
import FreetComponent from '@/components/Freet/FreetComponent.vue';
import TextEditor from '@/components/common/TextEditor.vue';

export default {
    name: 'DetailPage',
    components: {CommentComponent, FreetComponent, TextEditor},
    data() {
        return {
            post: null,
            comments: [],
            newCommentContent: "",
        }
    },
    props: {
        type: {
            type: String, 
            required: true
        },
        postId: {
            type: String,
            required: true
        }
    },
    methods: {
        async postComment() {
            let post_comment = `/api/comments`
            let r = await fetch(post_comment, {method: 'POST', body: JSON.stringify({parentId: this.postId, parentType: this.type, content: this.newCommentContent}), headers: {'Content-Type': 'application/json'}});
            let response = await r.json()
        }
    },
    async mounted() {
        let post_url = `/api/${this.type == 'Freet' ? 'freets' : 'comments'}/${this.postId}`
        let r = await fetch(post_url)
        let response = await r.json()
        this.post = response

        let comment_url = `/api/comments?parentId=${this.$route.params.freetId}`
        r = await fetch(comment_url)
        response = await r.json()
        this.comments = response
    },
}

</script>