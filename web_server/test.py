from database import Database


def test():
    i = 0
    
    while (acc := Database.get_account(i := i + 1)) is not None:
        print(acc)
    
    print('end')

if __name__ == '__main__':
    test()
