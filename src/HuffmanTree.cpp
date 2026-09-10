#include "HuffmanTree.h"
#include<queue>
#include<vector>
#include<string>

struct compare
{
    bool operator()(struct HuffmanNode* a, struct HuffmanNode* b)
    {
        return a->frequency > b->frequency;
    }
};

struct HuffmanNode* HuffmanTree::generateTree(const Frequency &f)
{
    std::priority_queue<struct HuffmanNode*, std::vector<HuffmanNode*>, compare> minHeap;

    int found = 0;
    for(int i=0; i<256 && found < f.uniqueBytes; i++)
    {
        if(f.freq[i] > 0)
        {
            struct HuffmanNode* node = new HuffmanNode();
            node->byte = static_cast<unsigned char>(i);
            node->frequency = f.freq[i];
            node->left = nullptr;
            node->right = nullptr;
            minHeap.push(node);
            found++;
        }
    }

    while(minHeap.size() > 1)
    {
        struct HuffmanNode* left = minHeap.top();
        minHeap.pop();
        struct HuffmanNode* right = minHeap.top();
        minHeap.pop();
        struct HuffmanNode* parent = new HuffmanNode();
        parent->byte = 0;
        parent->frequency = left->frequency + right->frequency;
        parent->left = left;
        parent->right = right;
        minHeap.push(parent);
    }
    if(minHeap.empty()) return NULL;
    return minHeap.top();
}

void HuffmanTree::codeHelper(struct HuffmanNode* root, std::string currentCode, std::array<std::string,256> &codes)
{
    if(root->left == NULL && root->right == NULL)
    {
        codes[root->byte] = currentCode;
        return;
    }
    if(root->left)
        codeHelper(root->left, currentCode + "0", codes);
    if(root->right)
        codeHelper(root->right, currentCode + "1", codes);
}

std::array<std::string, 256> HuffmanTree::generateCodes(struct HuffmanNode* root)
{
    std::array<std::string, 256> codes;

    if(!root) return codes;

    if(root->left == NULL && root->right == NULL)
    {
        codes[root->byte] = "0";
        return codes;
    }
     std::string currentCode = "";
    
    codeHelper(root, currentCode, codes);
    return codes;
}