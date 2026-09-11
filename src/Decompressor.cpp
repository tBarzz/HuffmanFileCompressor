#include "Decompressor.h"
#include "HuffmanTree.h"
#include "MagicSign.h"
#include <fstream>
#include <iostream>
#include <array>
#include <string>
#include <algorithm>

std::string Decompressor::decompress(const std::string &compressedFilePath)
{
    std::ifstream compressedFile(compressedFilePath, std::ios::binary);

    if(!compressedFile)
    {
        std::cerr << "FILE COULD NOT BE OPENED {decompressor i/p}";
        return "";
    }

    unsigned char validate[sizeof(magic)];
    compressedFile.read(
        reinterpret_cast<char*> (validate),
        sizeof(validate)
    );
    if(!compressedFile)
    {
        std::cerr<<"INVALID FILE FORMAT {decompressor header-m}";
        return "";
    }

    if(!std::equal(
        validate,
        validate + sizeof(validate),
        magic
    ))
    {
        std::cerr<<"INVALID FILE FORMAT {decompressor header-mv}";
        return "";
    }

    uint32_t fileLength;
    compressedFile.read(
        reinterpret_cast<char*> (&fileLength),
        sizeof(fileLength)
    );
    if(!compressedFile)
    {
        std::cerr<<"INVALID FILE FORMAT {decompress header -fl}";
        return "";
    }

    std::string fileName(fileLength, '\0');
    compressedFile.read(
        fileName.data(),
        fileLength
    );
    if(!compressedFile)
    {
        std::cerr<<"INVALID FILE FORMAT {decompres header -fn}";
        return "";
    }

    uint64_t originalFileSize;
    compressedFile.read(
        reinterpret_cast<char*> (&originalFileSize),
        sizeof(originalFileSize)
    );
    if(!compressedFile)
    {
        std::cerr<<"INVALID FILE FORMAT {decompress header -os}";
        return "";
    }

    int uniqueBytes;
    compressedFile.read(
        reinterpret_cast<char*> (&uniqueBytes),
        sizeof(uniqueBytes)
    );
    if(!compressedFile)
    {
        std::cerr<<"INVALID FILE FORMAT {decompress header-ub}";
        return "";
    }
    if(!(uniqueBytes>=1 && uniqueBytes<=256))
    {
        std::cerr<<"INVALID FILE FORMAT {decompress header-ubv}";
        return "";
    }

    uint64_t freq[256] = {};
    int check[256] = {};
    uint64_t new_size = 0;
    for(int i=0; i<uniqueBytes; i++)
    {
        unsigned char byte;
        compressedFile.read(
            reinterpret_cast<char*>(&byte),
            sizeof(byte)
        );
        if(!compressedFile)
        {
            std::cerr<<"INVALID FILE FORMAT {decompress header-b}";
            return "";
        }
        if(check[byte] == 0) check[byte]++;
        else
        {
            std::cerr<<"INVALID FILE FORMAT {decompress header-bv}";
            return "";
        }
        uint64_t f;
        compressedFile.read(
            reinterpret_cast<char*>(&f),
            sizeof(f)
        );
        if(!compressedFile)
        {
            std::cerr<<"INVALID FILE FORMAT {decompress header-f}";
            return "";
        }
        if(f==0)
        {
            std::cerr<<"INVALID FILE FORMAT {decompress header-fv}";
            return "";
        }

        freq[byte] = f;
        new_size += f;
    }
    if(new_size != originalFileSize)
    {
        std::cerr<<"INVALID FILE FORMAT {decompress header -sv}";
        return "";
    }

    Frequency freqObj{};
    freqObj.uniqueBytes = uniqueBytes;
    int found = 0;
    for(int i=0; i<256 && found<uniqueBytes; i++)
    {
        if(freq[i]>0)
        {
            freqObj.freq[i] = freq[i];
            found++;
        }
    }

    size_t dotPos = fileName.find_last_of('.');
    std::string extension = fileName.substr(dotPos);
    std::string newEnding = "_decompressed" + extension;
    std::string compressedEnding = "_compressed.huf";
    std::string decompFilePath = compressedFilePath.substr(0, compressedFilePath.size() - compressedEnding.size()) + newEnding;

    std::ofstream decompFile(decompFilePath, std::ios::binary);
    if(!decompFile)
    {
        std::cerr<<"FILE COULD NOT BE OPENED {decompressor o/p}";
        return "";
    }

    HuffmanTree huffTree;
    HuffmanNode* root = huffTree.generateTree(freqObj);
    if(root == NULL)
    {
        std::cerr<<"INVALID FILE FORMAT {decompressor tree}";
        return "";
    }

    HuffmanNode* curr = root;
    if(curr->left == NULL && curr->right == NULL)
    {
        for(uint64_t i=0; i<originalFileSize; i++)
        {
            decompFile.put(curr->byte);
        }
        return decompFilePath;
    }
    uint64_t decompressedSize = 0;
    while(decompressedSize < originalFileSize)
    {
        unsigned char packedByte;
        compressedFile.read(
            reinterpret_cast<char*> (&packedByte),
            sizeof(packedByte)
        );

        if(!compressedFile)
        {
            std::cerr<<"INVALID FILE FORMAT {decompressed byte read}";
            return "";
        }

        for(int i=0; i<8 && decompressedSize < originalFileSize; i++)
        {
            int bit = (packedByte>>(7-i)) & 1;
            (bit == 0) ? (curr = curr->left) : (curr = curr->right);
            if(curr->left == NULL && curr->right == NULL)
            {
                decompFile.put(curr->byte);
                decompressedSize++;
                curr = root;
            }
        }
    }
    return decompFilePath;
}