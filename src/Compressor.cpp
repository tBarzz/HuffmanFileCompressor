#include "Compressor.h"
#include "FrequencyCounter.h"
#include "HuffmanTree.h"
#include<string>
#include<array>
#include<fstream>
#include<iostream>

std::string Compressor::compress(const std::string &inputFilePath)
{
    size_t dot_pos = inputFilePath.find_last_of('.');
    size_t slashPos = inputFilePath.find_last_of("/\\");

    if(dot_pos == std::string::npos ||
    (slashPos != std::string::npos && dot_pos < slashPos))
    {
        std::cerr << "INPUT FILE MUST HAVE AN EXTENSION";
        return "";
    }

    FrequencyCounter frequencyCounter;
    HuffmanTree huffmanTree;
    std::array<std::string, 256> codes;
    
    Frequency f = frequencyCounter.calculateFreq(inputFilePath);
    if(f.uniqueBytes == 0)
    {
        std::cout<<"FILE IS EMPTY {compressor i/p check}";
        return "";
    }
    HuffmanNode* root = huffmanTree.generateTree(f);
    codes = huffmanTree.generateCodes(root);

    std::string outputFilePath = inputFilePath.substr(0,dot_pos) + "_compressed.huf";

    std::ofstream outputFile(outputFilePath, std::ios::binary);
    if(!outputFile)
    {
        std::cerr<<"FILE COULD NOT BE OPENED {compressor o/p}";
        return "";
    }

    uint64_t originalFileSize = 0;
    int found = 0;
    for(int i=0; i<256 && found < f.uniqueBytes; i++)
    {
        if(f.freq[i]>0)
        {
            originalFileSize += f.freq[i];
            found++;
        }
    }

    const unsigned char magic [] = {'H', 'F', 'C', '1', 0xA7, 0x3D, 0x92, 0xE1};
    outputFile.write(
        reinterpret_cast<const char*> (magic),
        sizeof(magic)
    );
    
    std::string fileName;

    if(slashPos == std::string::npos)
        fileName = inputFilePath;
    else
        fileName = inputFilePath.substr(slashPos + 1);
    
    uint32_t fileLength = static_cast<uint32_t> (fileName.size());

    outputFile.write(
        reinterpret_cast<const char*> (&fileLength),
        sizeof(fileLength)
    );

    outputFile.write(
        fileName.data(),
        fileLength
    );
     
    outputFile.write( 
        reinterpret_cast<const char*> (&originalFileSize),
        sizeof(originalFileSize)
    );

    outputFile.write(
        reinterpret_cast<const char*> (&f.uniqueBytes),
        sizeof(f.uniqueBytes)
    );

    found = 0;
    for(int i=0; i<256 && found < f.uniqueBytes; i++)
    {
        if(f.freq[i] > 0)
        {
            unsigned char index = static_cast<unsigned char>(i);

            outputFile.put(index);

            outputFile.write(
                reinterpret_cast<const char*> (&f.freq[i]),
                sizeof(f.freq[i])
            );

            found++;
        }
    }

    std::ifstream file(inputFilePath, std::ios::binary);

    if(!file) 
    {
        std::cerr<<"FILE COULD NOT BE OPENED {compressor i/p}";
        return "";
    }

    char byte;
    unsigned char buffer = 0;
    int bitCount = 0;
    while(file.read(&byte, 1))
    {
        unsigned char index = static_cast<unsigned char>(byte);
        std::string code = codes[index];
        for(auto bit: code)
        {
            int bit_val = bit - '0';
            buffer = (buffer<<1) | bit_val;
            bitCount++;
            if(bitCount == 8)
            {
                outputFile.put(buffer);
                bitCount=0;
                buffer=0;
            }
        }
    }
    if(bitCount > 0)
    {
        buffer = buffer << (8 - bitCount);
        outputFile.put(buffer);
    }

    return outputFilePath;
}