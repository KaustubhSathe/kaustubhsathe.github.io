---
title: "Centroid Decomposition Explained"
layout: post
date: 2020-02-13 01:06
image: /assets/images/markdown.jpg
headerImage: false
tag:
- markdown
- elements
star: true
category: blog
author: Kaustubh Sathe
description: Markdown summary with different options
---


```cpp
    #include<bits/stdc++.h>
    #define pb push_back
    #define mp make_pair
    #define pii pair<int,int>
    using namespace std;

    int n;
    vector<int> adj[1000000+5];
    vector<int> centroid[1000000+5];
    bool is_centroid[1000000+5];
    int sz[1000000+5],par[1000000+5],nn;
    vector<pii> disCentroidParent[100000+5];
    void dfs(int u,int p = -1){
        sz[u] = 1;
        for(auto x : adj[u]){
            if(x == p || is_centroid[x])continue;
            dfs(x,u);
            sz[u] += sz[x];
        }
    }
    void dfs2(int u,int p,int lvl,int rootNode){
        disCentroidParent[u].pb(mp(rootNode,lvl));
        for(auto x : adj[u]){
            if(x == p || is_centroid[x])continue;
            dfs2(x,u,lvl+1,rootNode);
        }
    }
    int get_centroid(int u,int p = -1){
        for(auto x : adj[u]){
            if(x == p || is_centroid[x])continue;
            if(sz[x] > nn/2) return get_centroid(x,u);
        }
        return u;
    }

    int decompose(int u){
        dfs(u);  
        nn = sz[u];
        int p = get_centroid(u);
        is_centroid[p] = true;
        dfs2(p,p,0,p);
        for(auto x : adj[p]){
            if(is_centroid[x])continue;
            int q = decompose(x);
            par[q] = p;
            centroid[p].pb(q);
            centroid[q].pb(p);
        }
        return p;
    }
    int main(){
        cin>>n;
        for(int i = 0;i<n-1;i++){
            int u,v;cin>>u>>v;
            adj[u].pb(v);
            adj[v].pb(u);
        }
        int root_centroid_tree = decompose(1);
        return 0;
    }
```
-------------------------------------------------------------------------------------------------------------------
 - Centroid Decomposition helps us to run dfs O(n) log(n)(one from each level in centroid tree).
 - Caution : the dfs run for calculating some property must be run in the corresponding part of the original tree and not in the centroid tree.
 - This helps us to calculate some given function(sum/multiply which can vary from problem to problem) between all pairs vertices efficiently. I.e by keeping the centroid as fixed and calculating the fucntion for all paths which pass through the given centroid. When we do this for all centroid top to bottom then we can generate all the nC2 paths efficiently.
 - When the problem says calculate something for all pairs of vartices in the given tree, it is may be possible that the given problem be solved using centroid decomposition.
-------------------------------------------------------------------------------------------------------------------

## Problems
**1. https://codeforces.com/problemset/problem/321/C** 
    **Solution** : Simple application, just rank each level of centroid tree with same character. Lower level gets higher rank. If number of levels > 26 then Impossible.
```cpp
    int n,max_level,color[1000000+5];
    vector<int> adj[1000000+5],centroid[1000000+5];
    bool is_centroid[1000000+5];
    int sz[1000000+5],nn;
    void dfs(int u,int p = -1){
        sz[u] = 1;
        for(auto x : adj[u]){
            if(x == p || is_centroid[x])continue;
            dfs(x,u);
            sz[u] += sz[x];
        }
    }
    int get_centroid(int u,int p = -1){
        for(auto x : adj[u]){
            if(x == p || is_centroid[x])continue;
            if(sz[x] > nn/2) return get_centroid(x,u);
        }
        return u;
    }
    
    int decompose(int u){
        dfs(u);
        nn = sz[u];
        int p = get_centroid(u);
        is_centroid[p] = true;
        for(auto x : adj[p]){
            if(is_centroid[x])continue;
            int q = decompose(x);
            centroid[p].pb(q);
            centroid[q].pb(p);
        }
        return p;
    }
    
    void dfs2(int u,int p,int lvl){
        max_level = max(max_level,lvl);
        color[u] = lvl;
        for(auto x : centroid[u]){
            if(x != p){
                dfs2(x,u,lvl + 1);
            }
        }
    }
    int main(){
        cin>>n;
        for(int i = 0;i<n-1;i++){
            int u,v;cin>>u>>v;
            adj[u].pb(v);
            adj[v].pb(u);
        }
        int root_centroid_tree = decompose(1);
        dfs2(root_centroid_tree,-1,0);
        if(max_level > 26){
            cout<<"Impossible"<<endl;
            return 0;
        }
    
        for(int i = 1;i<=n;i++){
            char ch = (char)(color[i] + 'A'); 
            cout<<ch<<" ";
        }
        cout<<endl;
    
    
        return 0;
    }
```

**2. https://codeforces.com/contest/342/problem/E**
    **Solution** : Let dp[i] denote the minimum distance to red node in the subtree of centroid i in the centroid tree.
    1. update query paint node x red : for all ancestors i of x do dp[i] = min(dp[i],dis(x,i)). Now this update takes log^2(n) time, but can be reduced to log(n) by using the optimization technique of caching the distance between node i and all its ancestors. This distance 2d array can be constructed during the construction of centroid tree.
    2. Finding nearest red node to node i : Let ans = INF, then for all ancestors x of i ans = min(ans,dis(i,x) + dp[x]), this will work because if the nearest red node is in the subtree of i then dis(i,i) + dp[i] will give the minimum and all its ancestors will be greater than this.

```cpp
    int n,m;
    vector<int> adj[100000+5];
    vector<int> centroid[100000+5];
    bool is_centroid[100000+5];
    int sz[100000+5],level[100000+5],par[100000+5],nn;
    vector<pii> disCentroidParent[100000+5];
    int dp[100000+5];
    
    void dfs(int u,int p = -1){
        sz[u] = 1;
        for(auto x : adj[u]){
            if(x == p || is_centroid[x])continue;
            dfs(x,u);
            sz[u] += sz[x];
        }
    }
    void dfs2(int u,int p,int lvl,int rootNode){
        disCentroidParent[u].pb(mp(rootNode,lvl));
        for(auto x : adj[u]){
            if(x == p || is_centroid[x])continue;
            dfs2(x,u,lvl+1,rootNode);
        }
    }
    int get_centroid(int u,int p = -1){
        for(auto x : adj[u]){
            if(x == p || is_centroid[x])continue;
            if(sz[x] > nn/2) return get_centroid(x,u);
        }
        return u;
    }
    
    int decompose(int u){
        dfs(u);  
        nn = sz[u];
        int p = get_centroid(u);
        is_centroid[p] = true;
        dfs2(p,p,0,p);
        for(auto x : adj[p]){
            if(is_centroid[x])continue;
            int q = decompose(x);
            par[q] = p;
            centroid[p].pb(q);
            centroid[q].pb(p);
        }
        return p;
    }
    void update(int u){
        for(auto itr : disCentroidParent[u]){
            dp[itr.ff] = min(dp[itr.ff],itr.ss);
        }
    }
    
    int query(int u){
        int ans = INF;
        for(auto itr : disCentroidParent[u]){
            ans = min(ans,itr.ss + dp[itr.ff]);
        }
        return ans;
    }
    
    
    int main(){
        fastio;
        for(int i =0;i<100000+5;i++)
            dp[i] = INF;
        // freopen("input.txt", "r", stdin);
        // freopen("output.txt", "w", stdout);
        cin>>n>>m;
        for(int i = 0;i<n-1;i++){
            int u,v;cin>>u>>v;
            adj[u].pb(v);
            adj[v].pb(u);
        }
        int root_centroid = decompose(1);
        par[root_centroid] = root_centroid;
        update(1);
        while(m--){
            int type,v;cin>>type>>v;
            if(type == 1){
                update(v);
            }else{
                cout<<query(v)<<endl;
            }
        }
        return 0;
    }
```        


**3. https://codeforces.com/contest/766/problem/E (Mahmoud and a xor trip)**
**Solution** : First get the centroid tree of the given tree.While decomposing the given tree maintain an array d[20][2], which denotes number of vertices which have the digit at place i as 0 or 1 in d[i][0] and d[i][1]. Now add the xors of all the paths which pass through the given centroid.

```cpp
    int n;
    lli a[100000+5],ans,d[20][2];
    vector<int> adj[100000+5];
    vector<int> centroid[1000000+5];
    bool is_centroid[1000000+5];
    int sz[1000000+5],par[1000000+5],nn;
    vector<pii> disCentroidParent[100000+5];
    void dfs(int u,int p = -1){
        sz[u] = 1;
        for(auto x : adj[u]){
            if(x == p || is_centroid[x])continue;
            dfs(x,u);
            sz[u] += sz[x];
        }
    }
    void dfs2(int u,int p,int lvl,int rootNode){
        disCentroidParent[u].pb(mp(rootNode,lvl));
        for(auto x : adj[u]){
            if(x == p || is_centroid[x])continue;
            dfs2(x,u,lvl+1,rootNode);
        }
    }
    int get_centroid(int u,int p = -1){
        for(auto x : adj[u]){
            if(x == p || is_centroid[x])continue;
            if(sz[x] > nn/2) return get_centroid(x,u);
        }
        return u;
    }
    void dfsCrossing(int u,int p,int now){
        for(int i = 0;i<20;i++){
            if((1<<i) & now){
                ans += 1ll*((1<<i))*d[i][0];
            }else{
                ans += 1ll*((1<<i))*d[i][1];
            }
        }
        for(auto x : adj[u]){
            if(x == p || is_centroid[x])continue;
            dfsCrossing(x,u,now^a[x]);
        }
    }
    void dfsAdding(int u,int p,int now){
        for(int i = 0;i<20;i++){
            if((1<<i) & now){
                d[i][1]++;
            }else{
                d[i][0]++;
            }
        }
        for(auto x : adj[u]){
            if(x == p || is_centroid[x])continue;
            dfsAdding(x,u,now^a[x]);
        }
    }
    
    int decompose(int u){
        dfs(u);  
        nn = sz[u];
        int p = get_centroid(u);
        is_centroid[p] = true;
        dfs2(p,p,0,p);
        for(int i = 0;i<20;i++){
            if((1<<i) & a[p]){
                d[i][1] = 1;
                d[i][0] = 0;
            }else{
                d[i][0] = 1;
                d[i][1] = 0;
            }
        }
        for(auto x : adj[p]){
            if(is_centroid[x])continue;
            dfsCrossing(x,p,a[x]);
            dfsAdding(x,p,a[p]^a[x]);
        }
        for(auto x : adj[p]){
            if(is_centroid[x])continue;
            int q = decompose(x);
            centroid[p].pb(q);
            centroid[q].pb(p);
        }
        return p;
    }
    int main(){
        fastio;
        // freopen("input.txt", "r", stdin);
        // freopen("output.txt", "w", stdout);
        cin>>n;
        for(int i = 1;i<=n;i++)
            cin>>a[i];
    
        for(int i = 0;i<n-1;i++){
            int u,v;cin>>u>>v;
            adj[u].pb(v);
            adj[v].pb(u);
        }
        int root_centroid = decompose(1);
        cout<<ans + accumulate(a+1,a+n+1,0ll)<<endl;
        
        return 0;
    }
```
    


**4. https://codeforces.com/contest/161/problem/D**
 **Solution** : There is dynamic programming solution to this problem(see this https://codeforces.com/contest/161/submission/66035427).But let's solve this using centroid decomposition. While decomposing the given tree maintain an array called d[50000+5] for every centroid (you don't actually need different array for every centroid as it won't be memory efficient, just use the same array declared globally for every centroid) in which d[i] denotes the number of paths of with length i ending at the current centroid.Then for every centroid run a dfs in its corresponding part in the original tree(not in the centroid tree), and if we are at lvl = x then add cnt += d[k-x] to the global answer,and after adding update the given d[50000+5] array.

    
```cpp
    int n,k;
    unordered_map<int,int> d;
    lli ans;
    vector<int> adj[1000000+5];
    vector<int> centroid[1000000+5];
    bool is_centroid[1000000+5];
    int sz[1000000+5],par[1000000+5],nn;
    vector<pii> disCentroidParent[100000+5];
    void dfs(int u,int p = -1){
        sz[u] = 1;
        for(auto x : adj[u]){
            if(x == p || is_centroid[x])continue;
            dfs(x,u);
            sz[u] += sz[x];
        }
    }
    void dfs2(int u,int p,int lvl,int rootNode){
        disCentroidParent[u].pb(mp(rootNode,lvl));
        for(auto x : adj[u]){
            if(x == p || is_centroid[x])continue;
            dfs2(x,u,lvl+1,rootNode);
        }
    }
    int get_centroid(int u,int p = -1){
        for(auto x : adj[u]){
            if(x == p || is_centroid[x])continue;
            if(sz[x] > nn/2) return get_centroid(x,u);
        }
        return u;
    }
    
    void dfsCross(int u,int p,int lvl){
        ans += d[k - lvl];
        for(auto x : adj[u]){
            if(x == p || is_centroid[x])continue;
            dfsCross(x,u,lvl + 1);
        }
    }
    void dfsAdd(int u,int p,int lvl){
        d[lvl]++;
        for(auto x : adj[u]){
            if(x == p || is_centroid[x])continue;
            dfsAdd(x,u,lvl + 1);
        }
    }
    int decompose(int u){
        dfs(u);  
        nn = sz[u];
        int p = get_centroid(u);
        is_centroid[p] = true;
        dfs2(p,p,0,p);
        d.clear();d[0] = 1;
        for(auto x : adj[p]){
            if(is_centroid[x])continue;
            dfsCross(x,p,1);
            dfsAdd(x,p,1);
        } 
        for(auto x : adj[p]){
            if(is_centroid[x])continue;
            int q = decompose(x);
            centroid[p].pb(q);
            centroid[q].pb(p);
        }
        return p;
    }
    
    int main(){
        fastio;
        // freopen("input.txt", "r", stdin);
        // freopen("output.txt", "w", stdout);
        cin>>n>>k;
        for(int i = 0;i<n-1;i++){
            int u,v;cin>>u>>v;
            adj[u].pb(v);
            adj[v].pb(u);
        }
        int root_centroid = decompose(1);
        cout<<ans<<endl;
        
        
        return 0;
    }
```

**5. https://www.hackerearth.com/problem/algorithm/number-of-paths-with-specific-length-f08e78de/**
**Solution** : A dynamic programming solution exists but let's first solve it using centroid decomposition.
```cpp
    #include<bits/stdc++.h>
    using namespace std;
    #define pii pair<int,int>
    #define pb push_back
    #define ff first
    #define ss second
    #define mp make_pair
    typedef long long int lli;

    int n,k;
    vector<pii> adj[100000+5];
    bool is_centroid[100000+5];
    int sz[100000+5],nn;
    lli ans[10],cnt[40];

    void dfs(int u,int p = -1){
        sz[u] = 1;
        for(auto x : adj[u]){
            if(x.ff == p || is_centroid[x.ff])continue;
            dfs(x.ff,u);
            sz[u] += sz[x.ff];
        }
    }
    int get_centroid(int u,int p = -1){
        for(auto x : adj[u]){
            if(x.ff == p || is_centroid[x.ff])continue;
            if(sz[x.ff] > nn/2) return get_centroid(x.ff,u);
        }
        return u;
    }
    void dfsCnt(int u,int p,int mask){
        for(int i = 0;i<32;i++){
            ans[__builtin_popcount(mask | i)] += cnt[i];
        }
        for(auto x : adj[u]){
            if(x.ff == p || is_centroid[x.ff])continue;
            dfsCnt(x.ff,u,(1<<x.ss) | mask);
        }
    }

    void dfsAdd(int u,int p,int mask){
        cnt[mask] += 1;
        for(auto x : adj[u]){
            if(x.ff == p || is_centroid[x.ff])continue;
            dfsAdd(x.ff,u,(1<<x.ss) | mask);
        }
    }

    int decompose(int u){
        dfs(u);  
        nn = sz[u];
        int p = get_centroid(u);
        is_centroid[p] = true;
        for(int i = 0;i<40;i++)
            cnt[i] = 0;
        
        cnt[0] = 1ll;
        for(auto x : adj[p]){
            if(is_centroid[x.ff])continue;
            dfsCnt(x.ff,p,1<<x.ss);
            dfsAdd(x.ff,p,1<<x.ss);
        }
        for(auto x : adj[p]){
            if(is_centroid[x.ff])continue;
            int q = decompose(x.ff);
        }
        return p;
    }
    int main(){
        cin>>n>>k;
        for(int i = 2;i<=n;i++){
            int p,c;
            cin>>p>>c;c--;
            adj[p].pb(mp(i,c));
            adj[i].pb(mp(p,c));
        }
        decompose(1);
        for(int i = 1;i<=k;i++){
            cout<<2*ans[i]<<" ";
        }
    }   
```

**6. https://wcipeg.com/problem/ioi1112**
```cpp
    #include<bits/stdc++.h>
    using namespace std;
    typedef long long int lli;
    #define pb push_back
    #define mp make_pair
    #define ff first
    #define ss second
    const int maxn = 200000+5; 
    struct custom_hash {
        static uint64_t splitmix64(uint64_t x) {
            // http://xorshift.di.unimi.it/splitmix64.c
            x += 0x9e3779b97f4a7c15;
            x = (x ^ (x >> 30)) * 0xbf58476d1ce4e5b9;
            x = (x ^ (x >> 27)) * 0x94d049bb133111eb;
            return x ^ (x >> 31);
        }

        size_t operator()(uint64_t x) const {
            static const uint64_t FIXED_RANDOM = chrono::steady_clock::now().time_since_epoch().count();
            return splitmix64(x + FIXED_RANDOM);
        }
    };
    int n,ans,is_centroid[maxn],sz[maxn],nn,cent;
    lli k;
    vector<pair<int,lli>> adj[maxn];
    unordered_map<lli,int,custom_hash> cnt[maxn];

    void dfs(int u,int p){
        sz[u] = 1;
        for(auto x : adj[u]){
            if(x.ff == p || is_centroid[x.ff])continue;
            dfs(x.ff,u);
            sz[u] += sz[x.ff];
        }
    }

    int get_centroid(int u,int p = -1){
        for(auto x : adj[u]){
            if(x.ff == p || is_centroid[x.ff])continue;
            if(sz[x.ff] > nn/2) return get_centroid(x.ff,u);
        }
        return u;
    }
    void dfs1(int u,int p,int lvl,lli w){
        if(k>=w && cnt[cent].find(k - w) != cnt[cent].end()){
            ans = min(ans,lvl + cnt[cent][k-w]);
        }
        for(auto x : adj[u]){
            if(x.ff == p || is_centroid[x.ff])continue;
            dfs1(x.ff,u,lvl+1,w + x.ss);
        }
    }

    void dfs2(int u,int p,int lvl,lli w){
        if(cnt[cent].find(w) == cnt[cent].end()){
            cnt[cent][w] = lvl;
        }else{
            cnt[cent][w] = min(cnt[cent][w],lvl);
        }
        for(auto x : adj[u]){
            if(x.ff == p || is_centroid[x.ff])continue;
            dfs2(x.ff,u,lvl+1,w + x.ss);
        }
    }

    int decompose(int u){
        dfs(u,-1);
        nn = sz[u];
        int p = get_centroid(u);
        cent = p;
        is_centroid[p] = 1;
        cnt[cent][0] = 0;
        for(auto x : adj[p]){
            if(is_centroid[x.ff])continue;
            dfs1(x.ff,p,1,x.ss);
            dfs2(x.ff,p,1,x.ss);
        }

        for(auto x : adj[p]){
            if(is_centroid[x.ff])continue;
            int q = decompose(x.ff);
        }

        return p;
    }

    int main(){
        cin>>n>>k;
        for(int i = 0;i<n-1;i++){
            int u,v;lli w;
            cin>>u>>v>>w;
            adj[u].pb(mp(v,w));
            adj[v].pb(mp(u,w));
        }
        ans = 1e9 + 5;
        decompose(0);
        ans = (ans == 1e9 + 5) ? -1 : ans; 
        cout<<ans<<endl;
    }
```


