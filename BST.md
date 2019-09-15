# Binary Search Tree

**Binary Search Tree** is a node-based binary tree data structure which has the following properties:

> **Traversals** 
> * Pre-order  : node,left,right (top to bottom traversal)
> * In-order   : left,node,right (left to right traversal)
> * Out-order  : right,node,left (right to left traversal)
> * Post-order : left,right,node (bottom to top traversal)

> **Properties**
> * The left subtree of a node contains only nodes with keys lesser than the node’s key.
> * The right subtree of a node contains only nodes with keys greater than the node’s key.
> * The left and right subtree each must also be a binary search tree.
> * Inorder traversal produces sorted output ascending.
> * We can construct a BST with only preorder,postorder or level order traversal



>  ### Construction of BST using preorder traversal
>  <img src="https://cdncontribute.geeksforgeeks.org/wp-content/uploads/BST.png" width="400" height="320"> $Preorder Traversal(5,2,1,3,12,9,21,19,25)$
> 
>  First element is always the root in preorder traversal (root,left,right). So in this example the root is 5, then we go to the left side which contains all the keys less than the root and then right which contains all the more than the root. So in this case (2,1,3) in left and (12,9,21,1,25) in right. At each root we need to find the index of the first key which is greater than the root. If we do it naively using a single for loop at root then worst case time complexity will be $O(n^2)$. But if we preprocess this information and finding the index becomes $O(1)$ operation we can do this task in $O(n)$. We do this preprocessing using stack.Another approach is that we keep a range $(min,max)$ for each node and if the key is within that range then create a node with the key and its left child will have range as $(min,key]$ and right child will have key as $[key+1,max)$.
> 
> [Leetcode Problem [1008] Construct Binary Search Tree from Preorder Traversal](https://leetcode.com/problems/construct-binary-search-tree-from-preorder-traversal/description/)
> 
>  ```cpp
> class Solution {
> public:
>     TreeNode* bstFromPreorder(vector<int>& preorder) {
>         vector<int> idx;idx.assign(preorder.size()+10,preorder.size());
>         stack<int> pq;
>         TreeNode* head = nullptr;
>         for(int i = 0;i<preorder.size();i++){
>             if(pq.empty()){
>                 pq.emplace(i);
>                 continue;
>             }
>             while(!pq.empty() && preorder[i] > preorder[pq.top()]){
>                 idx[pq.top()] = i;
>                 pq.pop();
>             }
>             pq.emplace(i);
>         }
>         function<TreeNode*(int,int)> rec = [&](int tl,int tr){
>             if(tl < tr){
>                 TreeNode* temp = new TreeNode(preorder[tl]);
>                 temp->left = rec(tl+1,idx[tl]-1);
>                 temp->right = rec(idx[tl],tr);
>                 return temp;
>             }else if(tl == tr){
>                 TreeNode* temp = new TreeNode(preorder[tl]);
>                 return temp;
>             }
>             TreeNode* temp = nullptr;
>             return temp;
>         };
>         head = rec(0,preorder.size()-1);
>         return head;
>     }
> };
>  ```


### Find postorder traversal of BST from preorder traversal

preorder(root,left,right) and postorder(left,right,root)

Simple Approach : first construct BST from given preorder traversal and then get the post order traversal of the BST.

Efficient Approach : We keep range $(min,max)$ for each key and if the key has left$(min,key]$ and right$[key+1,max)$ child,we first recursively build them first and then add the key value.


### Struct
```cpp
/**********************************************************
* - Data Fields
*       Node* head
* - Constructors
*       BST() : default constructor
*       BST(vector<int>& inp) : constructs BST on given input
* - Utils
*       insert(T val) : inserts val into BST
* - Functions      
*       vector<T> inOrder() : returns inorder traversal of BST
*       vector<T> outOrder() : returns outorder traversal of BST
*       vector<T> preOrder() : returns preorder traversal of BST
*       vector<T> postOrder() : returns postorder traversal of BST
*       void bstFromPreOrder(vector<T>& preOrder) : constructs BST from given pre-order traversal
*       
*       
*       
*       
*       
*       
*       
***********************************************************/
template<class T> struct BST{
    /*--------------------Data Fields--------------------*/
    struct Node{
        T key;
        Node *left,*right;
        Node(){}
        Node(T val,Node* _left = nullptr,Node* _right = nullptr) : key(val),left(_left),right(_right){}
    };
    Node* head;
    /*--------------------Constructors--------------------*/
    BST() : head(nullptr){}
    BST(vector<T>& inp){
        head = nullptr;
        for(auto x : inp)
            head = insert(x);
    }
    /*--------------------Utils--------------------*/
    Node* insert(T val){
        head = insert(head,val);
        return head;
    }
    Node* insert(Node* _head,T val){
        if(_head == nullptr){
            Node* temp = new Node(val);
            return temp;
        }
        if(val < _head->key)
            _head->left = insert(_head->left,val);
        else
            _head->right = insert(_head->right,val);

        return _head;
    }
    /*--------------------Functions--------------------*/
    vector<T> inOrder(){
        vector<T> ans;
        function<void(Node*)> rec = [&](Node* itr){
            if(itr == nullptr)
                return (Node*)nullptr;
            
            rec(itr->left);
            ans.push_back(itr->key);
            rec(itr->right);
        };
        rec(head);
        return ans;
    }
    vector<T> outOrder(){
        vector<T> ans;
        function<void(Node*)> rec = [&](Node* itr){
            if(itr == nullptr)
                return (Node*)nullptr;
            
            rec(itr->right);
            ans.push_back(itr->key);
            rec(itr->left);
        };
        rec(head);
        return ans;
    }
    vector<T> preOrder(){
        vector<T> ans;
        function<void(Node*)> rec = [&](Node* itr){
            if(itr == nullptr)
                return (Node*)nullptr;
            
            ans.push_back(itr->key);
            rec(itr->left);
            rec(itr->right);
        };
        rec(head);
        return ans;
    }
    vector<T> postOrder(){
        vector<T> ans;
        function<void(Node*)> rec = [&](Node* itr){
            if(itr == nullptr)
                return (Node*)nullptr;
            
            
            rec(itr->left);
            rec(itr->right);
            ans.push_back(itr->key);
        };
        rec(head);
        return ans;
    }
    void bstFromPreorder(vector<T>& preorder) {    
       vector<T> idx;idx.assign(preorder.size()+10,preorder.size());
       stack<T> pq;
       head = nullptr;
       for(T i = 0;i<preorder.size();i++){
           if(pq.empty()){
               pq.emplace(i);
               continue;
           }
           while(!pq.empty() && preorder[i] > preorder[pq.top()]){
               idx[pq.top()] = i;
               pq.pop();
           }
           pq.emplace(i);
       }
       function<Node*(T,T)> rec = [&](T tl,T tr){
           if(tl < tr){
               Node* temp = new Node(preorder[tl]);
               temp->left = rec(tl+1,idx[tl]-1);
               temp->right = rec(idx[tl],tr);
               return temp;
           }else if(tl == tr){
               Node* temp = new Node(preorder[tl]);
               return temp;
           }
           Node* temp = nullptr;
           return temp;
       };
       head = rec(0,preorder.size()-1);
       return head;
   }
};
```



 
   
 
 
