<template>
    <main class="container">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px;margin-bottom:10px">
            <div style="display:flex;align-items:center;gap:10px">
                <b-avatar size="6rem" :text="this.$route.params.username[0]"/>
                <h2>@{{this.$route.params.username}}</h2>
            </div>
            <div>
                <b-button v-if="$store.state.username !== this.$route.params.username" :variant="this.isFollowing ? 'primary' : 'outline-primary'" size="lg" @click="handleFollowClick">{{this.isFollowing ? 'Unfollow' : 'Follow'}}</b-button>
            </div>
        </div>
        <div style="display:flex;justify-content:center;margin-top:10px;margin-bottom:10px">
            <b-card body-class="cardBody" style="max-width:300px;flex-grow:1">
                <div class="stats" @click="handleFollowingClick">
                    <h5>Following</h5>
                    <h4>{{this.stats.following ?? 0}}</h4>
                </div>
                <div class="divider"/>
                <div class="stats" @click="handleFollowersClick">
                    <h5>Followers</h5>
                    <h4>{{this.stats.followers ?? 0}}</h4>
                </div>
            </b-card>
        </div>
        <section class="freetList">
            <FreetComponent v-for="freet in freets" :freet="freet" />
        </section>
    </main>
</template>

<script>
    import FreetComponent from '@/components/Freet/FreetComponent.vue';
    export default {
        components: {FreetComponent},
        data() {
            return {
                stats: {},
                freets: [],
                isFollowing: false
            }
        },
        methods: {
            handleFollowersClick() {
                console.log("FOLLOWERS")
            },
            handleFollowingClick() {
                console.log("FOLLOWING");
            },
            async handleFollowClick(){
                this.isFollowing ? await this.unfollowUser() : this.followUser();
            },
            async followUser() {
                let follow_url = `/api/followers/${this.$route.params.username}`;
                let r = await fetch(follow_url, {method: "POST"});
                let response = await r.json();
                this.$router.go();
            },
            async unfollowUser() {
                let unfollow_url = `/api/followers/${this.$route.params.username}`;
                let r = await fetch(unfollow_url, {method: "DELETE"});
                let response = await r.json();
                this.$router.go();
            }
        },
        async mounted() {
            let freets_url = `/api/freets?author=${this.$route.params.username}`;
            let r = await fetch(freets_url);
            let response = await r.json();
            this.freets = response;

            let stats_url = `/api/followers/stats?username=${this.$route.params.username}`;
            r = await fetch(stats_url);
            response = await r.json();
            this.stats = response;

            if(this.$store.state.username !== this.$route.params.username) {
                let following_url = `/api/followers/doesFollow?follower=${this.$store.state.username}&followee=${this.$route.params.username}`
                r = await fetch(following_url);
                response = await r.json();
                this.isFollowing = response.doesFollow;
            }
        }
    }
</script>

<style>
.cardBody {
    display: flex;
    justify-content: space-between;
    cursor: pointer;
    padding-left: 0px !important;
    padding-right: 0px !important;
}
.divider {
    flex-shrink: 1;
    border-width: 0px thin 0px 0px;
    border-style: solid;
    border-color: rgba(0, 0, 0, 0.20);
    height: auto;
    /* align-self: stretch; */
}

.stats {
    display:flex;
    flex-direction:column;
    align-items:center;
    flex-grow: 1;
}
</style>