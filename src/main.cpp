#include "Compressor.h"
#include "Decompressor.h"
#include <iostream>
#include <string>
#include <fstream>
#include <cstdio>
#include <limits>

int main(int argc, char* argv[])
{
    if(argc != 3)
    {
        std::cerr<<"INVALID INPUT {main i/p}";
        return 1;
    }
    int choice;
    //std::cout<<"\n1. Compression\n2. Decompression\n";
    //std::cout<<"\nEnter your choice: ";
    //std::cin>>choice;
    //std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
    choice = std::stoi(argv[1]);
    if(choice == 1)
    {
        std::string inputFilePath;
        //std::cout<<"\nEnter the Input File Path: ";
        //std::getline(std::cin, inputFilePath);
        inputFilePath = argv[2];
        std::string compressedFilePath;
        Compressor c;
        compressedFilePath = c.compress(inputFilePath);

        if(compressedFilePath.empty())
        {
            std::cout<<"COMPRESSION FAILED {main} {compression-module}";
            return 1;
        }

        std::string decompFilePath;
        Decompressor d;
        decompFilePath = d.decompress(compressedFilePath);

        if(decompFilePath.empty())
        {
            std::cout<<"Decompression FAILED {main} {compression-module}";
            return 1;
        }

        std::ifstream input(inputFilePath, std::ios::binary);
        std::ifstream decomp(decompFilePath, std::ios::binary);

        if(!input || !decomp)
        {
            std::cout<<"VALIDATION FILES NOT ACCESSIBLE {main} {compression-module}";
            return 1;
        }

        char originalByte;
        char decompByte;

        while(true)
        {
            input.read(&originalByte, 1);
            decomp.read(&decompByte, 1);
            bool inputRead = static_cast<bool>(input);
            bool decompRead = static_cast<bool>(decomp);
            if(!inputRead || !decompRead)
                break;
            if(originalByte != decompByte)
            {
                std::cout<<"COMPRESSION UNSUCCESSFUL {main} {compression-module}";
                return 1;
            }
        }
        if(input.eof() && decomp.eof())
        {
            input.close();
            decomp.close();
            std::cout<<"COMPRESSION SUCCESSFUL\nCompressed File created in same Directory as provided Input File";
            std::remove(decompFilePath.c_str());
            return 0;
        }
        else
        {
            std::cout<<"COMPRESSION UNSUCCESSFUL {main} {compression-module}";
            return 1;
        }
    }
    else if(choice == 2)
    {
        std::string compressedFilePath;
        //std::cout<<"\nEnter the Compressed File Path: ";
        //std::getline(std::cin, compressedFilePath);
        compressedFilePath = argv[2];

        Decompressor d;
        std::string decompFilePath = d.decompress(compressedFilePath);
        if(decompFilePath.empty())
        {
            std::cout<<"DECOMPRESSION FAILED {main} {decompression-module}";
            return 1;
        }
        std::cout<<"DECOMPRESSION SUCCESSFUL\nDecompressed File created in same Directory as provided Compressed File";
        return 0;
    }
    else
    {
        std::cerr<<"UNSUPPORTED OPERATION {main i/p}";
        return 1;
    }
}